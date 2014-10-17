var Phase = require('../models/phase');
'''
var PhaseSchema = new Schema({
    phaseType: { type: String, required: true },
    startDate: { type: Date, required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    endDate: { type: Date }
});
'''
module.exports = {
    // get all phases associated with id
    get: function(req, res){
        var applicationId = mongoose.Schema.Types.ObjectId(req.body.applicationId);
        Phase.find({application:applicationId}, function(err, docs){
            if (err) {
                // something bad happened
                console.error(err);
                res.redirect('/?error=Please try again');

            }
            return docs;
        });
    }

    // create new phase
    create: function(req, res){
        var applicationId = mongoose.Types.ObjectId(req.body.applicationId);
        var phaseType = req.body.phaseType;
        var endDate = req.body.endDate;
        
        var p = new Phase({
            'phaseType':phaseType,
            'startDate': new Date(),
            'application':applicationId,
            'endDate':endDate
        });

        p.save(function(error, p){
            if(error){
                // something bad happened
                console.error(err);
                res.redirect('/?error=Please try again');
            }
            else{
                return p._id;
            }

        });
    }
    
    //end phase and start a new one
    update: function(req, res){
        var phaseId = mongoose.Types.ObjectId(req.body.phaseId);
        var terminated = req.body.terminated == 'True';
        //update end date for current phase
        Phase.update({_id:phaseId}, function(error, p){
            p.endDate = Date();
            p.save(function(error, p){
                if(error){
                    // something bad happened
                    console.error(err);
                    res.redirect('/?error=Please try again');
                }
                else{
                    if(terminated){
                        //create a new terminated phase
                        var newP = new Phase({
                            'phaseType':'Terminated',
                            'startDate': new Date(),
                            'application': p.applicationId,
                            'endDate': new Date()
                        });

                        newP.save(function(error, p){
                            if(error){
                                console.error(err);
                                res.redirect('/?error=Please try again');
                            }
                            else{
                                return p._id;
                            }

                        });
                    }
                    else{
                        nextPhase = Phase.nextPhase(p._id);
                        //the current phase is already at terminated, no need to create a new one
                        if (nextPhase == 'Done') return null;
                        //create a new phase
                        var newP = new Phase({
                            'phaseType':nextPhase,
                            'startDate': new Date(),
                            'application': p.applicationId,
                            'endDate': null
                        });

                        newP.save(function(error, p){
                            if(error){
                                console.error(err);
                                res.redirect('/?error=Please try again');
                            }
                            else{
                                return p._id;
                            }

                        });

                    }
                }
            });
        });
    }

    // delete phase
    remove:function(req, res){

    }
    
}