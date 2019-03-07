import Level from './Level.js';

class DungeonLevel extends Level {

    constructor (config)
    {
        super((config) ? config : { key: 'dungeonlevel' });
        this.gridWidth = 64;
        this.gridHeight = 64;
        this.shardWidth = 8;
        this.shardHeight = 8;
        this.prefabShardWidth = this.shardWidth * 8; // 8 tiles of 8 pixels
        this.prefabShardHeight = this.shardHeight * 8;
        this.prefabMapWidth = this.gridWidth * this.prefabShardWidth;
        this.prefabMapHeight = this.gridHeight * this.prefabShardHeight;
    }

    create()
    {
        super.create();

        // setup stuff
        // ...

        // generate the dungeon (see DungeonPlugin.js)
        this.dungeon.generate(this.gridWidth, this.gridHeight);


        // get the merged tile data
        let tiledata = this.dungeon.createMapData({ shardW: this.shardWidth, shardH: this.shardHeight });

        // create the map
        let map = this.make.tilemap({ data: tiledata, tileWidth: 8, tileHeight: 8});
        let tiles = map.addTilesetImage('tiles', 'tiles', 8, 8, 0, 0);
        let layer = map.createStaticLayer(0, tiles, 0, 0);
        map.setCollisionBetween(192, 255);

        //console.log(this.dungeon.dungeon.size[0]);
        //console.log(this.dungeon.dungeon.size[1]);

        // clip the camera and physics,
        this.cameras.main.setBounds(0, 0, this.dungeon.dungeon.size[0] * this.prefabShardWidth, this.dungeon.dungeon.size[1] * this.prefabShardWidth);
        this.physics.world.setBounds(0, 0, this.dungeon.dungeon.size[0] * this.prefabShardWidth, this.dungeon.dungeon.size[1] * this.prefabShardWidth);

        // Add the player (see Level.js)
        let startPosition = this.dungeon.getStartPosition();
        this.addPlayer({ x: (startPosition.x + 0.5) * this.prefabShardWidth, y: (startPosition.y + 0.5) * this.prefabShardHeight });
        this.physics.add.collider(this.player, layer);

        this.cameras.main.setBackgroundColor('#85615a');

        // (see Level.js)
        this.postCreate();

    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
    }
}

export default DungeonLevel;
