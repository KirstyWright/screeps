var roles = {
    'harvester': {
        550: [MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
        250: [MOVE, CARRY, CARRY, WORK],
        200: [MOVE, CARRY, WORK]
        // 450: [MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    },
    'builder': {
        600: [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK],
        250: [MOVE, CARRY, WORK, WORK]
    },
    'upgrader': {
        600: [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK],
        250: [MOVE, CARRY, WORK, WORK]
    },
    'miner': {
        550: [MOVE, WORK, WORK, WORK, WORK, WORK],
        250: [MOVE, WORK, WORK]
    },
    'hauler': {
        450: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
        250: [MOVE, CARRY, CARRY, CARRY, CARRY],
        150: [MOVE, CARRY, CARRY],
    },
    'claimer': {
        800: [MOVE, MOVE, CLAIM, CARRY, CARRY]
    }
};

Spawn.prototype.queueCreep = function(data) {
    if (this.room.memory.spawnQueue == undefined) {
        this.room.memory.spawnQueue = [];
    }
    this.room.memory.spawnQueue.push({
        parts:roles[data.role][250],
        role: data.role,
        data:data
    });
}
Spawn.prototype.attemptSpawning = function() {
    if (this.room.memory.spawnQueue.length > 0) {
        for (key in this.room.memory.spawnQueue) {
            let creep = this.room.memory.spawnQueue[key];
            if (creep.spawned) {
                continue;
            }
            let response = -20;
            let name = this.generateCreepName(creep.data.role);
            creep.data.spawner = this.name;
            if (creep.role && roles[creep.role]) {

            let sortable = []
            for (cost in roles[creep.role]) {
                sortable.push({
                    "cost": cost,
                    "creep": roles[creep.role][cost]
                })
            }

            sortable.sort(function(a, b) {
                return a["cost"] < b["cost"];
            });

            for (key in sortable) {
                if (sortable[key].cost <= this.room.energyAvailable) {
                    response = this.spawnCreep(roles[creep.role][sortable[key].cost], name,{
                        memory: creep.data
                    });
                    break;
                }
            }
            } else {
                response = this.spawnCreep(creep.parts, name,{
                    memory:creep.data
                });
            }
            if (response == 0) {
                creep.spawned = true;
                creep.name = name;
                creep.spawner = this.name;
                this.room.memory.spawnQueue[0] = creep;
            }
            break;
        }
    }
}
Spawn.prototype.generateCreepName = function(role) {
    if (Memory.lastCreepId == undefined) {
        Memory.lastCreepId = 0;
    }
    Memory.lastCreepId = Memory.lastCreepId + 1;
    return role + "-" + Memory.lastCreepId;
}
