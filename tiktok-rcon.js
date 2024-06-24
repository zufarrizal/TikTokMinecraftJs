const { WebcastPushConnection } = require('tiktok-live-connector');
const { Rcon } = require('rcon-client');

// TikTok username
let tiktokUsername = 'mjup96'; // Ganti dengan username TikTok Anda

// RCON connection details
const rconHost = 'localhost'; // Ganti dengan host RCON Anda
const rconPort = 25575; // Ganti dengan port RCON Anda
const rconPassword = '123'; // Ganti dengan password RCON Anda

// Create a TikTok connection instance
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Create a RCON connection instance
const rconConnection = new Rcon({
    host: rconHost,
    port: rconPort,
    password: rconPassword,
});

// Connect to RCON
rconConnection
    .connect()
    .then(() => {
        console.log('Authenticated to RCON server');
    })
    .catch((err) => {
        console.error('Failed to connect to RCON server:', err);
    });

// Connect to TikTok Live
tiktokLiveConnection
    .connect()
    .then((state) => {
        console.info(`Connected to roomId ${state.roomId}`);
    })
    .catch((err) => {
        console.error('Failed to connect to TikTok Live:', err);
    });

// Event handler for "chat" event
tiktokLiveConnection.on('chat', (data) => {
    console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
    rconConnection.send(`say ${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
});

// Event handler for "gift" event
tiktokLiveConnection.on('gift', (data) => {
    console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);

    switch (data.giftId) {
        case 5655: // Gift Rose = Skeleton
            sendSummonCommand(data, 'Skeleton', 'minecraft:skeleton');
            break;
        case 5588: // Gift Nasi Lemak = Spider
            sendSummonCommand(data, 'Spider', 'minecraft:spider');
            break;
        case 5333: // Gift Coffee = Creeper
            sendSummonCommand(data, 'Creeper', 'minecraft:creeper');
            break;
        case 10585: // Gift Rendang Chicken = Zombified Piglin
            sendSummonCommand(data, 'Zombified Piglin', 'minecraft:zombified_piglin');
            break;
        case 6064: // Gift GG = Baked Potato
            sendSummonCommand(data, 'Baked Potato', 'minecraft:baked_potato');
            break;
        case 7024: // Gift Cantik Deh = Cooked Porkchop
            sendGiveCommand(data, 'Cooked Porkchop', 'minecraft:cooked_porkchop');
            break;
        case 5269: // Gift Tiktok = Steak
            sendGiveCommand(data, 'Steak', 'minecraft:cooked_beef');
            break;
        case 5827: // Gift Ice Cream Cone = Golden Carrot
            sendGiveCommand(data, 'Golden Carrot', 'minecraft:golden_carrot');
            break;
        case 5778: // Gift Ice Cream Cone = Enchanted Golden Apple
            sendGiveCommand(data, 'Enchanted Golden Apple', 'minecraft:enchanted_golden_apple');
            break;
        case 9583: // Gift Cakep = Iron Ingot
            sendGiveCommand(data, 'Iron Ingot', 'minecraft:iron_ingot');
            break;
        case 5462: // Gift Tahu Tempe = Gold Ingot
            sendGiveCommand(data, 'Gold Ingot', 'minecraft:gold_ingot');
            break;
        case 5487: // Gift Finger Heart = Diamond
            sendGiveCommand(data, 'Diamond', 'minecraft:diamond', 2);
            break;
        case 8136: // Gift Raya Rice = Ender Pearl
            sendGiveCommand(data, 'Ender Pearl', 'minecraft:ender_pearl');
            break;
        case 8913: // Gift Rosa = Ender Eye
            sendGiveCommand(data, 'Ender Eye', 'minecraft:ender_eye', 8);
            break;
        case 5779: // Gift Rosa = Pillager
            sendSummonCommand(data, 'Pillager', 'minecraft:pillager', 3);
            break;
        case 10972: // Gift Cow = Witch
            sendSummonCommand(data, 'Witch', 'minecraft:witch', 3);
            break;
        case 10293: // Gift Hi Bear = Vindicator
            sendSummonCommand(data, 'Vindicator', 'minecraft:vindicator', 3);
            break;
        case 9947: // Gift Friendship Necklace = Totem of Undying
            sendGiveCommand(data, 'Totem of Undying', 'minecraft:totem_of_undying', 2);
            break;
        case 10971: // Gift Eid Adha = Iron Armor
            sendIronArmorCommand(data);
            break;
        case 5780: // Gift Bucket = Diamond Armor
            sendDiamondArmorCommand(data);
            break;
        case 5879: // Gift Doughnut = Lava Pool
            sendLavaPoolCommand(data);
            break;
        case 10716: // Gift Blow a Kiss = Levitation
            sendLevitationCommand(data);
            break;
        case 5658: // Gift Perfume = Evoker
            sendGiftCommand(data, 'Evoker', 'minecraft:evoker', 3);
            break;
        case 9463: // Gift Fairy wings = Iron Golem
            sendGiftCommand(data, 'Iron Golem', 'minecraft:iron_golem');
            break;
        case 9371: // Gift Sweet Sheep = Nausea
            sendNauseaCommand(data);
            break;
        case 5566: // Gift Mishka Bear = Warden
            sendNonStreakableSummonCommand(data, 'Warden', 'minecraft:warden');
            break;
        case 7934: // Gift heart Me = Enchanted Golden Apple
            sendNonStreakableGiveCommand(data, 'Enchanted Golden Apple', 'minecraft:enchanted_golden_apple', 5);
            break;
        case 5599: // Gift Gold Necklace = Wither
            sendNonStreakableSummonCommand(data, 'Wither', 'minecraft:wither');
            break;
        case 6427: // Gift Hat and Mustache = Random Teleport
            sendRandomTeleportCommand(data);
            break;
        case 6427: // Gift Paper Crane = Darkness
            sendDarknessCommand(data);
            break;
        case 5585: // Gift Confetti = Elytra
            sendElytraCommand(data);
            break;
        case 5509: // Gift Sunglasses = Clear Inventory
            sendClearInventoryCommand(data);
            break;
        case 6267: // Gift Corgi = SERVER CRASH
            sendServerCrashCommand(data);
            break;
        default:
            rconConnection.send(`say ${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
            break;
    }
});

// Other event handlers...

function sendSummonCommand(data, giftName, command, quantity = 1) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x ${giftName}", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send(`execute at @p run summon ${command} ~ ~1 ~`);
    }
}

function sendGiveCommand(data, giftName, command, quantity = 1) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x ${giftName}", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send(`execute at @p run give @p ${command}`);
    }
}

function sendNonStreakableSummonCommand(data, giftName, command, quantity = 1) {
    rconConnection.send(`title @a subtitle {"text":"sent ${giftName}", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < quantity; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send(`execute at @p run summon ${command} ~ ~ ~`);
    }
}

function sendNonStreakableGiveCommand(data, giftName, command, quantity = 1) {
    rconConnection.send(`title @a subtitle {"text":"sent ${giftName}", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < quantity; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send(`execute at @p run give @p summon ${command} ~ ~ ~`);
    }
}

function sendIronArmorCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x Iron Armor", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send(
            'execute at @p run give @p iron_helmet{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:respiration",lvl:3},{id:"minecraft:aqua_affinity",lvl:1},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_chestplate{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_leggings{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_boots{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:feather_falling",lvl:4},{id:"minecraft:depth_strider",lvl:3},{id:"minecraft:frost_walker",lvl:2},{id:"minecraft:soul_speed",lvl:3},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_axe{Enchantments:[{id:"minecraft:sharpness",lvl:5},{id:"minecraft:smite",lvl:5},{id:"minecraft:bane_of_arthropods",lvl:5},{id:"minecraft:efficiency",lvl:5},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:fortune",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_pickaxe{Enchantments:[{id:"minecraft:efficiency",lvl:5},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:fortune",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_sword{Enchantments:[{id:"minecraft:sharpness",lvl:5},{id:"minecraft:smite",lvl:5},{id:"minecraft:bane_of_arthropods",lvl:5},{id:"minecraft:fire_aspect",lvl:2},{id:"minecraft:looting",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:sweeping_edge",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p iron_shovel{Enchantments:[{id:"minecraft:efficiency",lvl:5},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:fortune",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p bow{Enchantments:[{id:"minecraft:power",lvl:5},{id:"minecraft:punch",lvl:2},{id:"minecraft:flame",lvl:1},{id:"minecraft:infinity",lvl:1},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send('execute at @p run give @p arrow 64');
    }
}

function sendDiamondArmorCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x Diamond Armor", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send(
            'execute at @p run give @p diamond_helmet{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:respiration",lvl:3},{id:"minecraft:aqua_affinity",lvl:1},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_chestplate{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_leggings{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_boots{Enchantments:[{id:"minecraft:protection",lvl:4},{id:"minecraft:fire_protection",lvl:4},{id:"minecraft:blast_protection",lvl:4},{id:"minecraft:projectile_protection",lvl:4},{id:"minecraft:feather_falling",lvl:4},{id:"minecraft:depth_strider",lvl:3},{id:"minecraft:frost_walker",lvl:2},{id:"minecraft:soul_speed",lvl:3},{id:"minecraft:thorns",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_axe{Enchantments:[{id:"minecraft:sharpness",lvl:5},{id:"minecraft:smite",lvl:5},{id:"minecraft:bane_of_arthropods",lvl:5},{id:"minecraft:efficiency",lvl:5},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:fortune",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_pickaxe{Enchantments:[{id:"minecraft:efficiency",lvl:5},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:fortune",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_sword{Enchantments:[{id:"minecraft:sharpness",lvl:5},{id:"minecraft:smite",lvl:5},{id:"minecraft:bane_of_arthropods",lvl:5},{id:"minecraft:fire_aspect",lvl:2},{id:"minecraft:looting",lvl:3},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:sweeping_edge",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p diamond_shovel{Enchantments:[{id:"minecraft:efficiency",lvl:5},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:fortune",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send(
            'execute at @p run give @p bow{Enchantments:[{id:"minecraft:power",lvl:5},{id:"minecraft:punch",lvl:2},{id:"minecraft:flame",lvl:1},{id:"minecraft:infinity",lvl:1},{id:"minecraft:unbreaking",lvl:3},{id:"minecraft:mending",lvl:1}]}'
        );
        rconConnection.send('execute at @p run give @p arrow 64');
    }
}

function sendLavaPoolCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x Lava Pool", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send('execute at @p run fill ~-2 ~-1 ~-2 ~2 ~-1 ~2 lava');
    }
}

function sendLevitationCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x Levitation 5 Detik", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send('execute at @p run effect give @p minecraft:levitation 5 1 true');
    }
}

function sendNauseaCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent ${data.repeatCount} x Nausea 30 Detik", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    for (let i = 0; i < data.repeatCount; i++) {
        rconConnection.send(`execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1`);
        rconConnection.send('execute at @p run effect give @p minecraft:nausea 30 1 true');
    }
}

function sendRandomTeleportCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent Random Teleport", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    rconConnection.send('execute at @p run playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 10 1');
    rconConnection.send('spreadplayers ~ ~ 0 2000 false @a');
}

function sendDarknessCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent Darkness 1 Menit", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    rconConnection.send('execute at @p run playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 10 1');
    rconConnection.send('execute at @p run effect give @p minecraft:darkness 60 1 true');
}

function sendElytraCommand(data) {
    rconConnection.send(`title @a subtitle {"text":" sent Elytra", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    rconConnection.send('execute at @p run playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 10 1');
    rconConnection.send('execute at @p run give @p minecraft:elytra');
}

function sendClearInventoryCommand(data) {
    rconConnection.send(`title @a subtitle {"text":"sent Clear Inventory", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    rconConnection.send('execute at @p run playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 10 1');
    rconConnection.send('clear @p');
}

function sendServerCrashCommand(data) {
    rconConnection.send(`title @a subtitle {"text":"sent Server Crash", "color":"white"}`);
    rconConnection.send(`title @a title {"text":"${data.uniqueId}", "color":"yellow"}`);
    rconConnection.send('execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1');
    rconConnection.send('title @a subtitle {"text":"Countdown", "color":"white"}');
    rconConnection.send('title @a title {"text":"3", "color":"yellow"}');
    setTimeout(() => {
        rconConnection.send('execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1');
        rconConnection.send('title @a subtitle {"text":"Countdown", "color":"white"}');
        rconConnection.send('title @a title {"text":"2", "color":"yellow"}');
        setTimeout(() => {
            rconConnection.send('execute at @p run playsound minecraft:entity.experience_orb.pickup master @a ~ ~ ~ 10 1');
            rconConnection.send('title @a subtitle {"text":"Countdown", "color":"white"}');
            rconConnection.send('title @a title {"text":"1", "color":"yellow"}');
            setTimeout(() => {
                rconConnection.send('clear @p');
                rconConnection.send('stop');
            }, 1000);
        }, 1000);
    }, 1000);
}

// Event handler for "like" event
tiktokLiveConnection.on('like', (data) => {
    console.log(`${data.uniqueId} liked the stream. Total likes: ${data.likeCount}`);
    rconConnection.send(`say ${data.uniqueId} liked the stream. Total likes: ${data.likeCount}`);
});

// Event handler for "follow" event
tiktokLiveConnection.on('follow', (data) => {
    console.log(`${data.uniqueId} followed`);
    rconConnection.send(`say ${data.uniqueId} followed`);
});

// Event handler for "share" event
tiktokLiveConnection.on('share', (data) => {
    console.log(`${data.uniqueId} shared the stream`);
    rconConnection.send(`say ${data.uniqueId} shared the stream`);
});

// Event handler for "connect" event
tiktokLiveConnection.on('connect', () => {
    console.log('Connected to TikTok Live');
    rconConnection.send('say Connected to TikTok Live');
});

// Event handler for "disconnect" event
tiktokLiveConnection.on('disconnect', () => {
    console.log('Disconnected from TikTok Live');
    rconConnection.send('say Disconnected from TikTok Live');
});

// Event handler for errors
tiktokLiveConnection.on('error', (err) => {
    console.error('TikTok connection error:', err);
    rconConnection.send(`say TikTok connection error: ${err.message}`);
});
