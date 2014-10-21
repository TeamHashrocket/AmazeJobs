var Phase = require('../models/phase');
var handleError = require('./utils').handleError;

module.exports = {

    // get all phases associated with id
    getAll: function(req, res){
        var applicationId = req.body.applicationId;

        Phase.find({ application: applicationId }, function(err, phases){
            if (err) {
                // something bad happened
                console.error(err);
                res.status(500).send(err);

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
                res.status(500).send(err);

            } else {
                res.json({ phaseId: newPhase.id });
            }
        });
    },

    // delete phase
    delete: function(req, res){
        var phaseId = req.params.id;

        Phase.findByIdAndRemove(phaseId, function (err) {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            } else {
                res.end();
            }
        });
    }
    
}