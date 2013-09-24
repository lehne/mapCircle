/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 9/23/13
 * Time: 7:16 PM
 * To change this template use File | Settings | File Templates.
 */
function ToGeographic(mercatorX_lon, mercatorY_lat)
{
    var x, y,num3,num4,num5,num6,num7
    x = mercatorX_lon;
    y = mercatorY_lat;
    num3 = x / 6378137.0;     //WGS-84 semimajor axis in meters
    num4 = num3 * 57.295779513082323;  //degrees in a radian
    num5 = Math.floor((num4 + 180.0) / 360.0);
    num6 = num4 - (num5 * 360.0);
    num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0)));
    mercatorX_lon = num6;
    mercatorY_lat = num7 * 57.295779513082323;

    return {longitude:mercatorX_lon,latitude:mercatorY_lat};
}

function ToWebMercator(mercatorX_lon, mercatorY_lat)
{
    var num, x,a
    num = mercatorX_lon * 0.017453292519943295;
    x = 6378137.0 * num; //WGS-84 semimajor axis in meters to convert to meters
    a = mercatorY_lat * 0.017453292519943295;

    mercatorX_lon = x;
    mercatorY_lat = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    return {x:mercatorX_lon,y:mercatorY_lat};
}

function CreateCircleInWebMercator(x,y,radiusInMeters){
    //formula for circle is (x-h)^2+(y-k)^2=r^2

}