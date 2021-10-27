// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// NFT contract to inherit from.
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

// Helper functions OpenZeppelin provides.
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './libraries/Base64.sol';

import 'hardhat/console.sol';

contract NoNonsenseNftGame is ERC721 {
    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

    uint256 private seed;

    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
        bool hasDoubleAttack;
        bool hasDeathBlow;
    }

    // The tokenId is the NFTs unique identifier, it's just a number that goes
    // 0, 1, 2, 3, etc.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    CharacterAttributes[] defaultCharacters;

    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    BigBoss public bigBoss;

    // A mapping from an address => the NFTs tokenId. Gives me an ez way
    // to store the owner of the NFT and reference it later.
    mapping(address => uint256) public nftHolders;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        string memory bossName, // These new variables would be passed in via run.js or deploy.js.
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721('Zeroes', 'ZERO') {
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });

        console.log(
            'Done initializing boss %s w/ HP %s, img %s',
            bigBoss.name,
            bigBoss.hp,
            bigBoss.imageURI
        );

        // Loop through all the characters, and save their values in our contract so
        // we can use them later when we mint our NFTs.
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i],
                    hasDoubleAttack: false,
                    hasDeathBlow: false
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];

            console.log(
                'Done initializing %s w/ HP %s, img %s',
                c.name,
                c.hp,
                c.imageURI
            );

            // I increment tokenIds here so that my first NFT has an ID of 1.
            // More on this in the lesson!
            _tokenIds.increment();
        }
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );
        string memory strHasDoubleAttack = charAttributes.hasDoubleAttack
            ? 'true'
            : 'false';
        string memory strHasDeathBlow = charAttributes.hasDeathBlow
            ? 'true'
            : 'false';

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        charAttributes.name,
                        ' -- NFT #: ',
                        Strings.toString(_tokenId),
                        '", "description": "This is an NFT that lets people play in the No Nonsense NFT game!", "image": "',
                        charAttributes.imageURI,
                        '", "attributes": [ { "trait_type": "Health Points", "value": ',
                        strHp,
                        ', "max_value":',
                        strMaxHp,
                        '}, { "trait_type": "Attack Damage", "value": ',
                        strAttackDamage,
                        '}, { "trait_type": "Has Double Attack", "value": ',
                        strHasDoubleAttack,
                        '}, { "trait_type": "Has Death Blow", "value": ',
                        strHasDeathBlow,
                        '} ]}'
                    )
                )
            )
        );

        string memory output = string(
            abi.encodePacked('data:application/json;base64,', json)
        );

        return output;
    }

    function grantSpecialAbility() private returns (bool) {
        uint256 randomNumber = (block.difficulty + block.timestamp + seed) %
            100;
        console.log('Random # generated: %s', randomNumber);
        seed = randomNumber; // TODO this should be passed in instead, but YOLO for now.

        return randomNumber < 50;
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        // Get current tokenId (starts at 1 since we incremented in the constructor).
        uint256 newItemId = _tokenIds.current();

        // The magical function! Assigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        bool hasDoubleAttack = grantSpecialAbility();
        bool hasDeathBlow = !hasDoubleAttack && grantSpecialAbility();

        // We map the tokenId => their character attributes. More on this in
        // the lesson below.
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].hp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage,
            hasDoubleAttack: hasDoubleAttack,
            hasDeathBlow: hasDeathBlow
        });

        console.log(
            'Minted NFT w/ tokenId %s and characterIndex %s',
            newItemId,
            _characterIndex
        );
        console.log(
            'Does your NFT have special abilities? Has Double Attack: %s, Has Death Blow %s',
            hasDoubleAttack,
            hasDeathBlow
        );

        // Keep an easy way to see who owns what NFT.
        nftHolders[msg.sender] = newItemId;

        // Increment the tokenId for the next person that uses it.
        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        console.log(
            '\nPlayer w/ character %s about to attack. Has %s HP and %s AD',
            player.name,
            player.hp,
            player.attackDamage
        );
        console.log(
            'Boss %s has %s HP and %s AD',
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );

        // Make sure the player has more than 0 HP.
        require(player.hp > 0, 'Error: character must have HP to attack boss.');

        // Make sure the boss has more than 0 HP.
        require(bigBoss.hp > 0, 'Error: boss must have HP to attack boss.');

        // Allow player to attack boss.
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }

        // Allow boss to attack player.
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }

        // Console for ease.
        console.log('Boss attacked player. New player hp: %s\n', player.hp);

        emit AttackComplete(bigBoss.hp, player.hp);
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        // Get the tokenId of the user's character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return thier character.
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        // Else, return an empty character.
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }
}
