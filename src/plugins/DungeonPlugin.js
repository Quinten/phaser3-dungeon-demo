import Dungeon from 'dungeon-generator';

class DungeonPlugin extends Phaser.Plugins.BasePlugin
{
    constructor (pluginManager)
    {
        super(pluginManager);
        this.gridWidth = 0;
        this.gridHeight = 0;
    }

    start()
    {
        //console.log('DungeonPlugin started...');
    }

    generate(w, h) {
        this.gridWidth = w;
        this.gridHeight = h;
        this.dungeon = new Dungeon({
            "size": [w, h],
            "rooms": {
                "initial": {
                    "min_size": [4, 1],
                    "max_size": [4, 1],
                    "max_exits": 1
                },
                "any": {
                    "min_size": [2, 1],
                    "max_size": [8, 1],
                    "max_exits": 4
                }
            },
            "max_corridor_length": 8,
            "min_corridor_length": 2,
            "corridor_density": 0.5,
            "symmetric_rooms": false,
            "interconnects": 1,
            "max_interconnect_length": 10,
            "room_count": 30
        });

        this.dungeon.generate();
        //this.dungeon.print();
    }

    createMapData({ shardW = 8, shardH = 8 } = {})
    {
        let data = [];
        for (let y = 0; y < (this.gridHeight * shardH); y++) {
            let row = [];
            data.push(row);
            for (let x = 0; x < (this.gridWidth * shardW); x++) {
                row.push(0);
            }
        }
        for (let y = 0; y < this.dungeon.size[1]; y ++) {
            for (let x = 0; x < this.dungeon.size[0]; x++) {
                let tileNumber = this.dungeon.walls.get([x, y]) ? 206 : 0;
                for (let sy = 0; sy < shardH; sy++) {
                    for (let sx = 0; sx < shardW; sx++) {
                        let newX = (x * shardW) + sx;
                        let newY = (y * shardH) + sy;
                        data[newY][newX] = tileNumber;
                    }
                }
            }
        }
        return data;
    }

    getStartPosition()
    {
        return {x: this.dungeon.start_pos[0], y: this.dungeon.start_pos[1]};
    }
}

export default DungeonPlugin;
