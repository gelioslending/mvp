var api = require('./api.js');
const TEST = process.env.TEST; // TEST = AUTO


var userTest = function(r) {
    var t = pushAll(r);
    api.createUserInBc("rom", "123", "Ivan", "Ivanov", "Ivanovich", "01.01.1980", "4004 5453434", "ivalov@sber.ru", "+745345343534",
            "BORROWER", "{}","", "0", "101251","777866757667","bureauConsentDate","addressData",
            "registrationAddressData","1", "", function (ress) {
        if(!ress){t.push({"method":"registerUser          ","success":false});} else
        if(ress.status==false && ress.description == "Failed to add User (rom) already exists!"){
            t.push({"method":"registerUser           ","success":true});
        } else t.push({"method":"registerUser           ","success":ress.status});
        api.activateUserInBc("rom", "123", function (act) {
            t.push({"method":"activateUser           ","success":act.status});
            api.userLogin("rom", "123", function (log) {
                t.push({"method":"userLogin              ","success":log.status});
                api.createUserInBc("rom1", "123", "Ivan", "Ivanov", "Ivanovich", "01.01.1980", "4004 5453434", "ivalov@sber.ru", "+745345343534",
                    "BORROWER", "{}","", "0", "101251","777866757667","bureauConsentDate","addressData",
                    "registrationAddressData","1","",function (ress2) {
                    if(!ress2){t.push({"method":"registerUser           ","success":false});} else
                    if(ress2.status==false && ress2.description == "Failed to add User (rom1) already exists!"){
                        t.push({"method":"registerUser           ","success":true});
                    } else t.push({"method":"registerUser           ","success":ress2.status});

                    api.activateUserInBc("rom1", "123", function (act2) {
                        t.push({"method":"activateUser           ","success":act2.status});
                        api.userLogin("rom1", "123", function (log2) {
                            t.push({"method":"userLogin              ","success":log2.status});

                            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                            console.log(JSON.stringify(t));
                            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                            transTest(t);
                        })
                    })
                })
            })
        })
    })
}

var transTest = function (r) {
    var t = pushAll(r);
    api.setEthToUserInBc('rom','1234567890','', function (set) {
        t.push({"method":"setUserEth             ","success":set.status});
        api.setEthToUserInBc('rom1','0987654321','', function (set2) {
            t.push({"method":"setUserEth             ","success":set2.status});
            api.tokenTransferInBc('rom','rfwefsd523235235235','1234567890','0987654321','32.3','1', function (tr) {
                t.push({"method":"tokenTransfer          ","success":tr.status});

                api.getUser('rom', function (usr) {
                    if(usr && usr.status != false){
                        t.push({"method":"getUser                ","success":true});
                    } else t.push({"method":"getUser                ","success":usr.status});
                    api.getUser('rom1', function (usr1) {
                        if(usr1 && usr1.status != false){
                            t.push({"method":"getUser                ","success":true});
                        } else t.push({"method":"getUser                ","success":usr1.status});

                        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                        console.log(JSON.stringify(t));
                        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                        orderTest(t);
                    })
                })
            });
        })
    })

}

var orderTest = function(r) {
    var t = pushAll(r);
    api.createOrderInBc('rom','24','rom','','10000','20','2017-10-01','2018-10-01',function(ord) {
        t.push({"method": "createOrder            ", "success": ord.status});
        api.createOrderInBc('rom', '24', '', 'rom', '45000', '20', '2017-10-01', '2018-10-01', function (ord2) {
            t.push({"method": "createOrder            ", "success": ord2.status});
            api.getOrder('rom', '1', function (order) {
                t.push({"method": "getOrder               ", "success": getSt(order)});
                api.activateOffer("rom", ""+ord.orderId, function (off) {
                    t.push({"method": "activateOffer          ", "success": off.status});
                    api.activateOffer("rom", ""+ord2.orderId, function (off) {
                        t.push({"method": "activateOffer          ", "success": off.status});
                        api.getBorrowOffers("rom", "10000", "20", "24", "10000", "20", "24", function (bof) {
                            if (bof && bof.status) {
                                t.push({"method": "getBorrowOffers        ", "success": bof.status});
                            } else if (bof && bof.length>=0) {
                                t.push({"method": "getBorrowOffers        ", "success": true});
                            } else t.push({"method": "getBorrowOffers        ", "success": false});
                            api.getLendOffers("rom", "10000", "20", "24","10000", "20", "24", function (lof) {
                                if (lof && lof.status) {
                                    t.push({"method": "getLendOffers          ", "success": lof.status});
                                } else if (lof && lof.length>=0) {
                                    t.push({"method": "getLendOffers          ", "success": true});
                                } else t.push({"method": "getLendOffers          ", "success": false});

                                api.updateOrder('rom', '24', 'rom1', 'rom', '10000', '20', '2017-10-01', '2018-10-01',''+ord.orderId,"0", function (ordU) {
                                    t.push({"method": "updateOrder            ", "success": ordU.status});

                                    api.confirmOrder('rom', ''+ord.orderId, function (co) {
                                    t.push({"method": "confirmOrder           ", "success": co.status});

                                        api.confirmOrder('rom1', ''+ord.orderId, function (co2) {
                                            t.push({"method": "confirmOrder           ", "success": co2.status});

                                            api.activateOrderInBc('rom', '' + ord.orderId, function (ao) {
                                                t.push({"method": "activateOrder          ", "success": ao.status});

                                                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                                console.log(JSON.stringify(t));
                                                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                                scheduleTest(t,ord.orderId+"");
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}



var scheduleTest = function(r,orderId) {
    var t = pushAll(r);
    api.createSchedule('rom',orderId,//'123','10000','true','true','true','['+
    // '{"id":null,"issueDate":"2017-05-22","repaymentDate":"2017-06-22","principal":17309,"interest":24620,"lgot":false,"eachRepaymentFee":0,"rest":982691},'+
    // '{"id":null,"issueDate":"2017-06-22","repaymentDate":"2017-07-22","principal":18515,"interest":23414,"lgot":false,"eachRepaymentFee":0,"rest":964176},'+
    // '{"id":null,"issueDate":"2017-07-22","repaymentDate":"2017-08-22","principal":18191,"interest":23738,"lgot":false,"eachRepaymentFee":0,"rest":945985},'+
    // '{"id":null,"issueDate":"2017-08-22","repaymentDate":"2017-09-22","principal":18639,"interest":23290,"lgot":false,"eachRepaymentFee":0,"rest":927346},'+
    // '{"id":null,"issueDate":"2017-09-22","repaymentDate":"2017-10-22","principal":19834,"interest":22095,"lgot":false,"eachRepaymentFee":0,"rest":907512},'+
    // '{"id":null,"issueDate":"2017-10-22","repaymentDate":"2017-11-22","principal":19586,"interest":22343,"lgot":false,"eachRepaymentFee":0,"rest":887926},'+
    // '{"id":null,"issueDate":"2017-11-22","repaymentDate":"2017-12-22","principal":20773,"interest":21156,"lgot":false,"eachRepaymentFee":0,"rest":867153},'+
    // '{"id":null,"issueDate":"2017-12-22","repaymentDate":"2018-01-22","principal":20580,"interest":21349,"lgot":false,"eachRepaymentFee":0,"rest":846573},'+
    // '{"id":null,"issueDate":"2018-01-22","repaymentDate":"2018-02-22","principal":21086,"interest":20843,"lgot":false,"eachRepaymentFee":0,"rest":825487},'+
    // '{"id":null,"issueDate":"2018-02-22","repaymentDate":"2018-03-22","principal":23572,"interest":18357,"lgot":false,"eachRepaymentFee":0,"rest":801915},'+
    // '{"id":null,"issueDate":"2018-03-22","repaymentDate":"2018-04-22","principal":22186,"interest":19743,"lgot":false,"eachRepaymentFee":0,"rest":779729}]',
        function(sch){

        api.createSchedule('rom',orderId,//'1234','20000','false','false','true','['+
            // '{"id":null,"issueDate":"2018-05-22","repaymentDate":"2018-06-22","principal":1739,"interest":2460,"lgot":false,"eachRepaymentFee":0,"rest":98691},'+
            // '{"id":null,"issueDate":"2018-06-22","repaymentDate":"2018-07-22","principal":1855,"interest":2344,"lgot":false,"eachRepaymentFee":0,"rest":96176},'+
            // '{"id":null,"issueDate":"2018-07-22","repaymentDate":"2018-08-22","principal":1811,"interest":2378,"lgot":false,"eachRepaymentFee":0,"rest":94985},'+
            // '{"id":null,"issueDate":"2018-08-22","repaymentDate":"2018-09-22","principal":1869,"interest":2320,"lgot":false,"eachRepaymentFee":0,"rest":92346},'+
            // '{"id":null,"issueDate":"2018-09-22","repaymentDate":"2018-10-22","principal":1984,"interest":2205,"lgot":false,"eachRepaymentFee":0,"rest":90512},'+
            // '{"id":null,"issueDate":"2018-10-22","repaymentDate":"2018-11-22","principal":1956,"interest":2233,"lgot":false,"eachRepaymentFee":0,"rest":88926},'+
            // '{"id":null,"issueDate":"2019-03-22","repaymentDate":"2019-04-22","principal":2216,"interest":1973,"lgot":false,"eachRepaymentFee":0,"rest":77729}]',
            function(sch2){

            t.push({"method":"createSchedule         ","success":sch.status});
            t.push({"method":"createSchedule         ","success":sch2.status});
            api.getScheduleById('rom',''+sch.scheduleId,function (getSc) {
                t.push({"method": "getSchedule            ", "success": getSt(getSc)});
                api.setActiveSchedule('rom', ''+sch.scheduleId, orderId, function (as) {
                    t.push({"method": "setActiveSchedule      ", "success": as.status});
                    api.getActiveSchedule('rom', orderId, function (gas) {
                        t.push({"method": "getActiveSchedule      ", "success": getSt(gas)});
                        api.getScheduleList('rom', orderId, function (gsl) {
                            t.push({"method": "getScheduleList        ", "success": getListSt(gsl)});
                            api.getListOfTranchesByDate('rom', '2017-01-01', '2019-01-01', function (tran) {
                                if(tran){
                                    if(tran.result){
                                        t.push({"method": "getListOfTranchesByDate", "success": true});
                                    } else t.push({"method": "getListOfTranchesByDate", "success": false});
                                } else t.push({"method": "getListOfTranchesByDate", "success": false});

                                api.paymentTranche('rom','2017-11-22', ''+sch.scheduleId, "100000", function(pt){
                                    t.push({"method": "paymentTranche         ", "success": pt.status});

                                    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                                    var rets = (JSON.stringify(t)).split('},{').join('},\n{');
                                    console.log(rets);
                                    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                                })
                            })
                        })
                    })
                })
            })
        })
    })
}


var getSt = function(val){
    if(val){
        if(val.id){
            return true;
        } else return false;
    } else return false;
}

var getListSt = function(val){
    if(val){
        if(val.length){
            return getSt(val[0]);
        } else return false;
    } else return false;
}

var pushAll = function(val){
    var res = [];
    if(val)
        if(val.length>0)
            for(var i=0;i<val.length;i++){
                res.push(val[i])
            }
    return res;
}

if(TEST=="auto"){
    setTimeout(function () {
        userTest();
    }, 5000)
}

