/**
 * Created by superjang on 15. 3. 24..
 */

var oUrlManager = {
    // 매니저객체 전역멤버
    g : {
        nOrdStamp : 0,
        nTimeStamp : 0,
        nTimer : null
    },
    fnInit : function(sInstanceID){
        fnSetCookie("user",sInstanceID);
        this.fnSetConnection();
        this.fnEventBind();
    },
    fnSetConnection : function(nOrdStamp, nTimeStamp){
        this.g.nOrdStamp = nOrdStamp || this.g.nOrdStamp;
        this.g.nTimeStamp = nTimeStamp || this.g.nTimeStamp;
        // timestap 초기값?
        var queryString = {'nOrdStamp' : this.g.nOrdStamp, 'nTimeStamp' : this.g.nTimeStamp};
        $.ajax({
            type : 'GET',
            url : 'setConnection.php',
            data : queryString,
            context : this,
            success : function(data){
                var obj = jQuery.parseJSON(data);
                this.g.nOrdStamp = obj.nOrdStamp;
                this.g.nTimeStamp = obj.nTimeStamp;
                this.fnSetConnection(obj.nOrdStamp, obj.nTimeStamp);
            },
            error : function(xhr, status){
                if(status == "error" && xhr.status !== 504){
                    alert(this.fnErrorCatch(xhr));
                }else if(status == "error" && xhr.status === 504){
                    this.fnSetConnection(this.g.nOrdStamp, this.g.nTimeStamp);
                }
            }
        });
    },
    fnErrorCatch : function(xhr){
        if(xhr.status){
            return {
                403 : 'Not connect.n Verify Network.',
                404 : 'Requested page not found. [404]',
                500 : 'Internal Server Error [500].',
                503 : 'Service Unavailable [503].'
            }[xhr.status];
        }
    },
    fnSetStatus : function(htUiInfo){
        var queryString = {
            'who' : fnGetCookie("user"),
            'where' : htUiInfo.where,
            'what' : htUiInfo.what,
            'how' : htUiInfo.how,
            'value' : htUiInfo.value
        };
        $.ajax({
            type : 'GET',
            url : 'setStatus.php',
            data : queryString,
            context : this,
            success : function(data){
                var obj = jQuery.parseJSON(data);
                this.fnDrawUi(obj);
            },
            error : function(){

            }
        });
    },
    fnEventBind : function(){
        var _that = this;
        $("input").on("keyup",function(e){console.log("keyup")
            clearTimeout(_that.g.nTimer);
            _that.g.nTimer = setTimeout(function(){
                _that.fnSetStatus({
                    who : fnGetCookie("user"),
                    where : $(this).attr("id"),
                    what : null, //modification status
                    how : null,
                    value : $(this).val()
                });
            },1000);
        });
        $("input").on("keydown",function(e){console.log("keydown")
            clearTimeout(_that.g.nTimer);
        });
        $("input").on("focus",function(e){console.log("focus")
            _that.fnSetStatus({
                who : fnGetCookie("user"),
                where : $(this).attr("id"),
                what : null, //modification status
                how : null,
                value : $(this).val()
            });
        });
        $("input").on("blur",function(e) {console.log("blur")
            _that.fnInitUi();
        });
    },
    fnDrawUi : function(obj){console.log("draw")
        var oUi = {
            who : obj.who,
            where : obj.where,
            what : obj.what,
            how : obj.how,
            value : obj.value
        }
        var field = $('#'+oUi.where);
        field.val(oUi.value);
    },
    fnInitUi : function(){console.log("drawInit")
        // UI 초기화를 위한 접근가능 UI멤버 선언
    }
};
