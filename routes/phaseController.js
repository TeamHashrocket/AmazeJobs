var Phase = require('../models/phase');

module.exports = {

    // get all phases associated with id
    getAll: function(req, res){
        var applicationId = req.body.applicationId;

        Phase.find({ application: applicationId }, function(err, phases){
            if (err) {
                // something bad happened
                console.error(err);
                res.send(500, err);

            } else {
                res.json({ phases: phases });
            }
        });
    },

    // create new phase
    create: function(req, res){
        var applicationId = req.body.applicationId;
        var phaseType = req.body.phaseType;
        
        var phase = new Phase({
            'phaseType': phaseType,
            'startDate': new Date(),
            'application': applicationId
        });

        phase.save(function(error, newPhase){
            if(error){
                // something bad happened
                console.error(err);
                res.send(500, err);

            } else {
                res.json({ phaseId: newPhase.id });
            }
        });
    },
    
    // end phase and start a new one
    update: function(req, res){
        var phaseId = req.body.phaseId;
        var terminated = req.body.terminated == 'True';

        // update end date for current phase
        Phase.findOneAndUpdate({ _id: phaseId }, { endDate: Date() }, function(err, phase){
            var newPhase;
            var nextPhase = Phase.nextPhase(phase.phaseType);

            if(terminated){
                //create a new terminated phase
                newPhase = new Phase({
                    'phaseType':'Terminated',
                    'startDate': new Date(),
                    'application': phase.applicationId,
                    'endDate': new Date()
                });

            } else if (nextPhase != 'Done') { // make sure we're not at a terminal phase
                // create a new phase
                var newPhase = new Phase({
                    'phaseType':nextPhase,
                    'startDate': new Date(),
                    'application': p.applicationId
                });

            } else {
                // we're in a terminal phase, return nothing
                return res.end();
            }


            // save the new phase and return its id
            newPhase.save(function(error, savedPhase){
                if(error){
                    // something bad happened
                    console.error(err);
                    res.send(500, err);

                } else {
                    res.json({ phaseId: savedPhase.id });
                }

            });
            
        });
    },

    // delete phase
    delete: function(req, res){
        var phaseId = req.body.phaseId;

        Phase.remove({ _id: phaseId }, function (err) {
            if (err) {
                console.error(err);
                res.send(500, err);
            } else {
                res.end();
            }
        });
    }
    
}