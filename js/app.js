/**
 * Created by superjang on 15. 3. 24..
 */

var oUrlManager = {
    // 매니저객체 전역멤버
    g : {
        nOrdStamp : 0,
        nTimeStamp : 0,
        nTimer : null,
        oConf : {
            statusCallSec : 1000
        }
    },
    /**
     * urlManager 초기화
     * @param sInstanceID
     */
    fnInit : function(sInstanceID){
        fnSetCookie("user",sInstanceID);
        this.fnSetConnection();
        this.fnEventBind();
    },
    /**
     * 롱폴링 구현을 위한 커넥션
     * @param nOrdStamp
     * @param nTimeStamp
     */
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
            /**
             * ajax 값 내려받은 후 내려받은 스템프를 매개변수로 재귀호출
             * @param data
             */
            success : function(data){
                var obj = jQuery.parseJSON(data);
                this.g.nOrdStamp = obj.nOrdStamp;
                this.g.nTimeStamp = obj.nTimeStamp;
                this.fnSetConnection(obj.nOrdStamp, obj.nTimeStamp);
            },
            /**
             * ajax 예외처리 504일 경우 즉시 재연결
             * @param xhr
             * @param status
             */
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
    /**
     * 상태정보를 가져오기위한 ajax call
     * @param htUiInfo
     */
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
            /**
             * 내려받은 값으로 UI 컨트롤
             * @param data
             */
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
        $("input").on("keyup",function(e){
            clearTimeout(_that.g.nTimer);
            _that.g.nTimer = setTimeout(function(){
                _that.fnSetStatus({
                    who : fnGetCookie("user"),
                    where : $(this).attr("id"),
                    what : null, //modification status
                    how : null,
                    value : $(this).val()
                });
            }, _that.g.oConf.statusCallSec);
        });
        $("input").on("keydown",function(e){
            clearTimeout(_that.g.nTimer);
        });
        $("input").on("focus",function(e){
            _that.fnSetStatus({
                who : fnGetCookie("user"),
                where : $(this).attr("id"),
                what : null, //modification status
                how : null,
                value : $(this).val()
            });
        });
        $("input").on("blur",function(e) {
            _that.fnInitUi();
        });
    },
    /**
     * 내려받은 status의 값으로 UI 조작
     * @param obj
     */
    fnDrawUi : function(obj){
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
    /**
     * 해당 사용자의 UI 초기화
     */
    fnInitUi : function(){
        // UI 초기화를 위한 접근가능 UI멤버 선언
    }
};
