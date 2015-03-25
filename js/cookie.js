/**
 * Created by superjang on 15. 3. 24..
 */

/**
 * 쿠키값 추출
 * @param sCookieName 쿠키명
 * @returns {boolean}
 */
function fnGetCookie(sCookieName){
    var oCookie = document.cookie,
        nStartIndex = null,
        nEndIndex = null;

    if (oCookie.length > 0){
        // 해당 쿠키명이 존재하는지 검색한 후 존재하면 위치를 리턴.
        nStartIndex = oCookie.indexOf(sCookieName);
        if (nStartIndex != -1){
            nStartIndex += sCookieName.length;
            nEndIndex = oCookie.indexOf(";", nStartIndex);
            if (nEndIndex == -1) nEndIndex = oCookie.length;
            return unescape(oCookie.substring(nStartIndex + 1, nEndIndex));
            //return true;
        }else{
            // 쿠키 내에 해당 쿠키가 존재하지 않을 경우
            return false;
        }
    }else{
        return false;
    }
}

/**
 * 쿠키 설정
 * @param sCookieName 쿠키명
 * @param sCookieValue 쿠키값
 * @param nExpireDate 쿠키 유효날짜
 */
function fnSetCookie(sCookieName, sCookieValue){
    var nExpireDate = 9999;
    var today = new Date();
    today.setDate(today.getDate() + parseInt(nExpireDate));
    document.cookie = sCookieName + "=" + escape(sCookieValue) + "; path=/; expires=" + today.toGMTString() + ";";
}

/**
 * 쿠키 삭제
 * @param sCookieName 삭제할 쿠키명
 */
function fnDeleteCookie(sCookieName){
    var nExpireDate = new Date();
    //어제 날짜를 쿠키 소멸 날짜로 설정한다.
    nExpireDate.setDate(nExpireDate.getDate()-1);
    document.cookie = sCookieName + "= " + "; expires=" + nExpireDate.toGMTString() +"; path=/";
}
