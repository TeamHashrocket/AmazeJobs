var Phase = require('../models/phase');
var handleError = require('./utils').handleError;

module.exports = {

    // get all phases associated with id
    getAll: function(req, res){
        var applicationId = req.params.id;

        Phase.find({ application: applicationId }, function(err, phases){
            if (err) return handleError(res, 500, err);
            res.json({ phases: phases });
        });
    },

    // create new phase
    create: function(req, res){
        var applicationId = req.params.id;
        var phaseType = req.body.phaseType;

        var phase = new Phase({
            'phaseType': phaseType,
            'startDate': new Date(),
            'application': applicationId
        });

        phase.save(function(error, newPhase){
            if (error) return handleError(res, 500, err);
            res.json({ phaseId: newPhase.id });
        });
    },

    // delete phase
    delete: function(req, res){
        var phaseId = req.params.id;

        Phase.findByIdAndRemove(phaseId, function (err) {
            if (err) return handleError(res, 500, err);
        });
    }
    
}