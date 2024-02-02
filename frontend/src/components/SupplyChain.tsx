
import {
    useWeb3React,
    Contract,
    ethers,
    Signer,
    MouseEvent,
    ReactElement,
    useEffect,
    useState,
    Provider,
    StyledActionButton,
    StyledContainer,
    TopSection,
    BottomSection,
    ItemListContainer,
    ActionButtonContainer,
    StyledItemCard,
    StyledLabel,
    Item,
    State,
    Role,
    SupplyChainArtifact,
    SectionDivider
} from './Base';



export function SupplyChain(): ReactElement {
    const context = useWeb3React<Provider>();
    const { library, active } = context;

    const [signer, setSigner] = useState<Signer>();
    const [supplyChainContract, setSupplyChainContract] = useState<Contract>();
    const [supplyChainContractAddr, setSupplyChainContractAddr] = useState<string>('');
    const [allItems, setAllItems] = useState<Item[]>([]);
    const [role, setRole] = useState<Role>(Role.Unknown);
    const [isOwner, setOwner] = useState<Boolean>(false);
    const [isFarmer, setFarmer] = useState<Boolean>(false);
    const [isDistributor, setDistributor] = useState<Boolean>(false);
    const [isRetailer, setRetailer] = useState<Boolean>(false);
    const [isConsumer, setConsumer] = useState<Boolean>(false);


    useEffect((): void => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    //if page refreshed, this useEffect will restore the contract
    useEffect(() => {
        const storedContractAddr = localStorage.getItem('supplyChainContractAddr');

        if (storedContractAddr) {
            setSupplyChainContractAddr(storedContractAddr);

            const supplyChainContract = new Contract(storedContractAddr, SupplyChainArtifact.abi, signer);
            setSupplyChainContract(supplyChainContract);
            updateItems(supplyChainContract);

        }
    }, [signer]);




    useEffect(() => {

        if (!signer) {
            return;
        }

        if (supplyChainContract) {
            const contractWithSigner = supplyChainContract.connect(signer);

            contractWithSigner.on("Harvested", (upc, event) => {
                console.log(`Item Harvested - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} harvested successfully!`);
            });

            contractWithSigner.on("Processed", (upc, event) => {
                console.log(`Item Processed - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} hrocessed successfully!`);
            });

            contractWithSigner.on("Packed", (upc, event) => {
                console.log(`Item Packed - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`🌍 Item ${upc} Packed successfully!`);
            });

            contractWithSigner.on("ForSale", (upc, event) => {
                console.log(`Item ForSale - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} forSale successfully!`);
            });

            contractWithSigner.on("Sold", (upc, event) => {
                console.log(`Item Sold - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} sold successfully!`);
            });

            contractWithSigner.on("Shipped", (upc, event) => {
                console.log(`Item Shipped - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} shipped successfully!`);
            });

            contractWithSigner.on("Received", (upc, event) => {
                console.log(`Item Received - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} received successfully!`);
            });

            contractWithSigner.on("Purchased", (upc, event) => {
                console.log(`Item Purchased - UPC: ${upc}`);
                updateItems(contractWithSigner);
                window.alert(`Item ${upc} purchased successfully!`);
            });

            return () => {
                contractWithSigner.removeAllListeners();
            };
        }
    }, [supplyChainContract, signer]);


    useEffect((): (() => void) | undefined => {
        if (!signer || !supplyChainContract || !library) {
            return;
        }

        const getRoleHandler = (): void => {
            getRole(signer, supplyChainContract)
                .then((result) => {
                    console.log("Current role: " + roleToString(result));
                    setRole(result);
                    setFarmer(result === Role.Farmer);
                    setDistributor(result === Role.Distributor);
                    setRetailer(result === Role.Retailer);
                    setConsumer(result === Role.Consumer);
                    setOwner(result === Role.Owner || result === Role.Unknown);
                })
                .catch((error) => {
                    setOwner(true);
                    console.error("Error checking roles:", error);
                    setRole(Role.Unknown);
                });
        };

        library.on('block', getRoleHandler);

        return (): void => {
            library.removeListener('block', getRoleHandler);
        };
    }, [library, signer, supplyChainContract]);


    async function handleDeployContract(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (supplyChainContract || !signer) {
            return;
        }

        async function deployPlanetContract(signer: Signer): Promise<void> {
            const SupplyChain = new ethers.ContractFactory(
                SupplyChainArtifact.abi,
                SupplyChainArtifact.bytecode,
                signer
            );

            try {
                const supplyChain = await SupplyChain.deploy();
                await supplyChain.deployed();

                localStorage.setItem('supplyChainContractAddr', supplyChain.address);

                window.alert(`🚀 Supply Chain Contract Deployed to: ${supplyChain.address} 🌌`);

                setSupplyChainContract(supplyChain);
                setSupplyChainContractAddr(supplyChain.address);
            } catch (error: any) {
                window.alert(
                    'Error!' + (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        deployPlanetContract(signer);
    }

    async function handleDestroyContract(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            await supplyChainContract.kill();
            setSupplyChainContract(undefined);
            setSupplyChainContractAddr('');
            // localStorage.removeItem('supplyChainContractAddr');
            window.alert('🔥 Supply Chain Contract destroyed!');
        } catch (error: any) {
            window.alert(
                'Error destroying contract!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function updateItems(contractWithSigner: Contract) {
        try {
            const fetchedItems = await contractWithSigner?.getAllItems();
            setAllItems(fetchedItems || []);
        } catch (error: any) {
            console.error('Error fetching items:', error);
        }
    }

    async function handleHarvestItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer) {
            setOwner(true);
            window.alert('👽 Your Role is unknown! 👽');
            return;
        }
        async function harvestItem(signer: Signer): Promise<void> {
            try {
                const contractWithSigner = supplyChainContract?.connect(signer);

                const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';
                const farmNameInput = prompt('What is your farm name?') || '';
                const farmInfoInput = prompt('Tell us about farm Information') || '';
                const latLongInput = prompt('What is your farm location with this format (lat,long)?') || '0,0';
                const noteInput = prompt('Any note you want to add to the product?') || '';

                //Validate inputs
                if (isNaN(parseInt(upcInput)) || !farmNameInput || !farmInfoInput || !latLongInput || !noteInput) {
                    window.alert('Invalid input. Please provide valid data');
                    return;
                }

                const upc = parseInt(upcInput);
                const farmerId = signer.getAddress();
                const farmName = farmNameInput;
                const farmInfo = farmInfoInput;
                const [lat, long] = latLongInput.split(',');
                const note = noteInput;

                await contractWithSigner?.harvestItem(upc, farmerId, farmName, farmInfo, lat, long, note);
            } catch (error: any) {
                window.alert(
                    'Error harvesting item!' +
                    (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        harvestItem(signer);
    }

    async function handleProcessItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer) {
            window.alert('👽 Your Role is unknown! 👽');
            return;
        }

        async function proccessItem(signer: Signer): Promise<void> {
            try {
                const contractWithSigner = supplyChainContract?.connect(signer);

                const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';

                if (isNaN(parseInt(upcInput))) {
                    window.alert('Invalid input. Please provide valid data');
                    return;
                }

                const upc = parseInt(upcInput);

                await contractWithSigner?.processItem(upc);
            } catch (error: any) {
                window.alert(
                    'Error processing item!' +
                    (error && error.message ? `\n\n${error.message}` : '')
                );
            }
        }

        proccessItem(signer);
    }

    async function handlePackItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';

            if (isNaN(parseInt(upcInput))) {
                window.alert('Invalid input. Please provide valid data');
                return;
            }

            const upc = parseInt(upcInput);

            await contractWithSigner?.packItem(upc);
        } catch (error: any) {
            window.alert(
                'Error packing item!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function handleItemUpForSale(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';
            const priceInput = prompt('What is the price for this item?') || '0';

            if (isNaN(parseInt(upcInput)) || isNaN(parseFloat(priceInput))) {
                window.alert('Invalid input. Please provide valid data');
                return;
            }

            const upc = parseInt(upcInput);
            const price = parseFloat(priceInput);

            await contractWithSigner?.sellItem(upc, price);
        } catch (error: any) {
            window.alert(
                'Error putting item up for sale!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function handleBuyItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';

            const valueInput = prompt('How much you want to send?') || '0';

            if (isNaN(parseInt(upcInput)) || isNaN(parseInt(valueInput))) {
                window.alert('Invalid input. Please provide valid data');
                return;
            }

            const upc = parseInt(upcInput);
            const value = parseInt(valueInput);
            console.log("balance send: " + valueInput);
            await contractWithSigner?.buyItem(upc, { value });
        } catch (error: any) {
            window.alert(
                'Error buying item!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function handleShipItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';

            if (isNaN(parseInt(upcInput))) {
                window.alert('Invalid input. Please provide valid data');
                return;
            }

            const upc = parseInt(upcInput);

            await contractWithSigner?.shipItem(upc);
        } catch (error: any) {
            window.alert(
                'Error shipping item!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function handleReceiveItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';

            if (isNaN(parseInt(upcInput))) {
                window.alert('Invalid input. Please provide valid data');
                return;
            }

            const upc = parseInt(upcInput);

            await contractWithSigner?.receiveItem(upc);
        } catch (error: any) {
            window.alert(
                'Error receiving item!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function handlePurchaseItem(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            const upcInput = prompt('What is the Universal Product Code (UPC)?') || '0';

            if (isNaN(parseInt(upcInput))) {
                window.alert('Invalid input. Please provide valid data');
                return;
            }

            const upc = parseInt(upcInput);

            await contractWithSigner?.purchaseItem(upc);
        } catch (error: any) {
            window.alert(
                'Error purchasing item!' +
                (error && error.message ? `\n\n${error.message}` : '')
            );
        }
    }

    async function handleAddRole(roleToAdd: Role): Promise<void> {

        const address = prompt('Wallet Address?') || '';

        if (!signer || !supplyChainContract) {
            window.alert('👽 Signer or Contract not available 👽');
            return;
        }

        try {
            const contractWithSigner = supplyChainContract.connect(signer);

            switch (roleToAdd) {
                case Role.Farmer:
                    const farmer = await contractWithSigner.addFarmer(address);
                    setFarmer(farmer);
                    break;
                case Role.Distributor:
                    const distributor = await contractWithSigner.addDistributor(address);
                    setDistributor(distributor);
                    break;
                case Role.Retailer:
                    const retailer = await contractWithSigner.addRetailer(address);
                    setRetailer(retailer);
                    break;
                case Role.Consumer:
                    const consumer = await contractWithSigner.addConsumer(address);
                    setConsumer(consumer);
                    break;
                default:
                    break;
            }

            window.alert(`Role ${roleToString(roleToAdd)} added successfully!`);
        } catch (error: any) {
            window.alert(
                `Error adding ${roleToString(roleToAdd)} role: ${error && error.message ? `\n\n${error.message}` : ''
                }`
            );
        }
    }

    return (
        <StyledContainer>

            <StyledLabel>
                Contract Address: 
            </StyledLabel>
                {supplyChainContractAddr ? supplyChainContractAddr : <em>&lt;Contract not yet deployed&gt;</em>}
           
            <StyledLabel>
                Your Role: 
            </StyledLabel>
            {roleToString(role)}
            <TopSection>
                {isOwner && (
                    <>

                        <ActionButtonContainer>
                            <StyledActionButton
                                disabled={!active || !!supplyChainContract}
                                onClick={handleDeployContract}
                            >
                                Deploy Supply Chain Contract
                            </StyledActionButton>
                        </ActionButtonContainer>

                        <ActionButtonContainer>
                            <StyledActionButton
                                disabled={!active || !supplyChainContract}
                                onClick={handleDestroyContract}
                            >
                                🔥 Destroy Supply Chain Contract
                            </StyledActionButton>
                        </ActionButtonContainer>


                        <SectionDivider />

                        <ActionButtonContainer>
                            <StyledActionButton
                                disabled={!active || !supplyChainContract}
                                onClick={() => handleAddRole(Role.Farmer)}
                            >
                                Add Farmer
                            </StyledActionButton>
                        </ActionButtonContainer>

                        <ActionButtonContainer>
                            <StyledActionButton
                                disabled={!active || !supplyChainContract}
                                onClick={() => handleAddRole(Role.Distributor)}
                            >
                                Add Distributor
                            </StyledActionButton>
                        </ActionButtonContainer>

                        <ActionButtonContainer>
                            <StyledActionButton
                                disabled={!active || !supplyChainContract}
                                onClick={() => handleAddRole(Role.Retailer)}
                            >
                                Add Retailer
                            </StyledActionButton>
                        </ActionButtonContainer>

                        <ActionButtonContainer>
                            <StyledActionButton
                                disabled={!active || !supplyChainContract}
                                onClick={() => handleAddRole(Role.Consumer)}
                            >
                                Add Consumer
                            </StyledActionButton>
                        </ActionButtonContainer>
                    </>
                )}

                <SectionDivider />
            </TopSection>

            <BottomSection>
                {(isFarmer || isOwner) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handleHarvestItem}
                        >
                            🌱 Harvest Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Process Item Button */}
                {(isFarmer || isOwner) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handleProcessItem}
                        >
                            ⚙️ Process Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Pack Item Button */}
                {(isFarmer || isOwner) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handlePackItem}
                        >
                            📦 Pack Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Put Item Up For Sale Button */}
                {(isFarmer || isOwner) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handleItemUpForSale}
                        >
                            💰 Put Item For Sale
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Buy Item Button */}
                {(isDistributor) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handleBuyItem}
                        >
                            🛒 Buy Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Ship Item Button */}
                {(isDistributor) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handleShipItem}
                        >
                            🚚 Ship Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Receive Item Button */}
                {(isRetailer) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handleReceiveItem}
                        >
                            📦 Receive Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}

                {/* Purchase Item Button */}
                {(isConsumer) && (
                    <ActionButtonContainer>
                        <StyledActionButton
                            disabled={!active || !supplyChainContract}
                            onClick={handlePurchaseItem}
                        >
                            🛍️ Purchase Item
                        </StyledActionButton>
                    </ActionButtonContainer>
                )}
            </BottomSection>

            <ItemListContainer>
                <h2>All Items</h2>
                {allItems.map((item: Item, index: number) => (
                    <StyledItemCard key={index}>
                        <strong>Universal Product Code: </strong>{Number(item.upc)}<br />
                        <strong>Product ID: </strong>{Number(item.productID)}<br />
                        <strong>Product Notes: </strong>{item.productNotes}<br />
                        <strong>Owner address: </strong>{item.ownerID}<br />
                        <strong>Farmer address: </strong>{item.originFarmerID}<br />
                        <strong>Farm name: </strong>{item.originFarmName}<br />
                        <strong>Farm Information: </strong>{item.originFarmInformation}<br />
                        <strong>Status: </strong>{Object.values(State)[Number(item.itemState)]}<br />
                        <strong>Price: </strong>{Number(item.productPrice)}<br />
                        <strong>Farm Location: </strong>{item.originFarmLatitude},{item.originFarmLongitude}<br />
                        <strong>Distributor ID: </strong>{item.distributorID}<br />
                        <strong>Retailer ID: </strong>{item.retailerID}<br />
                        <strong>Consumer ID: </strong>{item.consumerID}<br />
                    </StyledItemCard>
                ))}
            </ItemListContainer>
        </StyledContainer>
    );

}

async function getRole(signer: Signer, supplyChainContract: Contract): Promise<Role> {
    if (!signer || !supplyChainContract) {
        return Role.Unknown;
    }

    const signerAddress = await signer.getAddress();

    if (await supplyChainContract.isOwner(signerAddress)) {
        return Role.Owner;
    }

    if (await supplyChainContract.isFarmer(signerAddress)) {
        return Role.Farmer;
    }

    if (await supplyChainContract.isDistributor(signerAddress)) {
        return Role.Distributor;
    }

    if (await supplyChainContract.isRetailer(signerAddress)) {
        return Role.Retailer;
    }

    if (await supplyChainContract.isConsumer(signerAddress)) {
        return Role.Consumer;
    }

    return Role.Unknown;
}

function roleToString(role: Role): string {
    switch (role) {
        case Role.Owner:
            return "Owner";
        case Role.Farmer:
            return "Farmer";
        case Role.Distributor:
            return "Distributor";
        case Role.Retailer:
            return "Retailer";
        case Role.Consumer:
            return "Consumer";
        case Role.Unknown:
            return "Unknown";
        default:
            return "Invalid";
    }
}