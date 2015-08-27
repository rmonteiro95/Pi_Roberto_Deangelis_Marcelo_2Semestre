var Calciumtrice = Calciumtrice || {};

Calciumtrice.Mapa_Dinamico = function () {};

Calciumtrice.Mapa_Dinamico.prototype = {
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.mapaGlobal = new Module(this.game, 'mapaGlobalJSON');
        this.modules = {};
        this.modules['casa-00'] = new Module(this.game, 'casaJSON');
        
//        this.mapaGlobal.addTilesetImage('tileset_tiled', 'grassLandTileset');
        this.layerChao = this.mapaGlobal.createLayer('chao');
        this.layerChao.resizeWorld();
        
        
        this.player = this.mapaGlobal.createFromObject('objetos', 8, 'heroi', 0, true, true, Jogador);
        this.player.cria();
        
        // Place the subMaps
        this.subMaps = {};
		//Roberto - aqui pega tudos os objtetos do tipo submap e adiciona no objeto subMaps
        var subMapLocations = this.mapaGlobal.findObjectsByType('submap');
        var location, tileX, tileY;
        for (var i = 0; i < subMapLocations.length; i++) {
            location = subMapLocations[i];
            tileX = location.x / 32;
            tileY = location.y / 32;
			//linha 12 modules
            this.subMaps[location.name] = new SubMap(this.modules[location.properties.sub_map], tileX, tileY);
        }
        this.subMaps['casa00'].setIndoorAlpha(0);
        
        this.doorGroup = this.game.add.group();
        var tiledDoors = this.mapaGlobal.findObjectsByType('porta');
        this.doors = {};
        var doorSprite = this.mapaGlobal.spriteFromObject(tiledDoors[0], this.doorGroup);
        Door.init(this.game);
        this.doors[doorSprite.properties.id] = new Door(this.game, doorSprite);
    },
    doorHandler: function(player, doorSprite) {
        var door = this.doors[doorSprite.properties.id];

        // This will update the doors "delta", telling us how far over the player is.
        door.overlapTrigger(player);
        console.log(door.delta)
        var alpha = door.delta;
        this.subMaps[doorSprite.properties.parent].setIndoorAlpha(alpha);
        this.subMaps[doorSprite.properties.parent].setOutdoorAlpha(1 - alpha);
        this.isOutdoors = !door.isOpen();
    },
    update: function () {        
        this.game.physics.arcade.overlap(this.player.shadow, this.doorGroup, this.doorHandler, null, this);
    }
};