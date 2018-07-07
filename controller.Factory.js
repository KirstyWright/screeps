/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controller.Factory');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    creating: false,
    run: function()
    {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        let debugString = "";
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        debugString += 'H:'+harvesters.length;
        if (harvesters.length < 4) {
            this.createCreep('harvester');
        }
        let transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
        debugString += ' T:'+transporters.length;
        if (transporters.length < 5) {
            this.createCreep('transporter');
        }
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        debugString += ' B:'+builders.length;
        if (builders.length < 5) {
            this.createCreep('builder');
        }
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        debugString += ' U:'+upgraders.length;
        if (upgraders.length < 5) {
            this.createCreep('upgrader');
        }
        // console.log(debugString);
    },
    roles: {
        'harvester': [WORK, WORK, MOVE],
        'transporter': [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY],
        'builder': [MOVE,WORK,WORK,CARRY],
        'upgrader': [MOVE,WORK,WORK,CARRY]
    },
    createCreep: function(type)
    {
        let spawn = Game.spawns['Spawn'];
        if (spawn.energy < 300 || this.creating) {
            return;
        }
        response = spawn.createCreep(this.roles[type],undefined,{role:type});
        if (isNaN(response)) {
            console.log('Creating creep ('+type+') '+response);
            this.creating = true;
        } else {
            console.log('Error creating creep: '+response);
        }
    }
};

// [MOVE,WORK,CARRY,CARRY,CARRY]
// Game.spawns['Spawn'].createCreep([MOVE,WORK,CARRY,CARRY,CARRY], 'TransportSmall1',{ role: 'transporter'});
// Game.spawns['Spawn'].createCreep([MOVE,WORK,CARRY], undefined,{ role: 'transporter'});
