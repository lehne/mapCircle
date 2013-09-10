/**
 * Created with JetBrains WebStorm.
 * User: Jeff Lehnert
 * Date: 9/10/13
 * Time: 7:44 PM
 *
 */
/*
The MIT License

 Copyright (c) 2013 by Jeff Lehnert
 original done in python 2007 by Nick Galbreath
 https://code.google.com/p/kmlcircle/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */
 //Convert (x,y,z) on unit sphere
 //back to (long, lat)
 //
 //p is vector of three elements
function toEarth(p) {
    var longitude, latitude, DEG, colatitude;
    if (p.x == 0) {
        longitude = Math.PI / 2.0;
    } else {
        longitude = Math.atan(p.y / p.x);
    }
    colatitude = Math.acos(p.z);
    latitude = (Math.PI / 2.0 - colatitude);
    if (p.x < 0.0) {
        if (p.y <= 0.0) {
            longitude = -(Math.PI - longitude);
        } else {
            longitude = Math.PI + longitude;
        }
    }
    DEG = 180.0 / Math.PI;
    return {longitude: longitude * DEG, latitude: latitude * DEG};
}

function toCart(longitude, latitude){
    var theta = longitude;
    var phi = Math.PI/2.0 - latitude;
    // spherical coordinate use "co-latitude", not "lattitude"
    // latitude = [-90, 90] with 0 at equator
    // co-latitude = [0, 180] with 0 at north pole
    return {x:Math.cos(theta)*Math.sin(phi),y:Math.sin(theta)*Math.sin(phi),z:Math.cos(phi)};
}


function spoints(longitude,latitude,meters,n,offset){
    //constant to convert to radians
    var RAD = Math.PI/180.0;
    //mean radius of earth in meters
    var MR = 6378.1 * 1000.0;
    var offsetRadians = offset * RAD;
    // compute long degrees in rad at a given lat
    var r = (meters/(MR * Math.cos(lat * RAD)));
    var vec = toCart(longitude*RAD, latitude* RAD);
    var pt = toCart(longitude*RAD + r, latitude*RAD);
    var pts = [];
    for(i=0;i<=n;i++){
        pts.push(toEarth(rotPoint(vec,pt,offsetRadians + (2.0 * Math.PI/n)*i)));
    }
    //add another point to connect back to start
    pts.push(pts[0]);
    return pts;
}

function rotPoint(vec,pt,phi){
    //remap vector for clarity
    var u, v, w, x, y,z;
    u=vec.x;
    v=vec.y;
    w=vec.z;
    x=pt.x;
    y=pt.y;
    z=pt.z;
    var a, d,e;
    a=u*x + v*y + w*z;
    d = Math.cos(phi);
    e=Math.sin(phi);
    return {x:(a*u + (x-a*u)*d+ (v*z-w*y)*e),y:(a*v + (y - a*v)*d + (w*x - u*z) * e),z:(a*w + (z - a*w)*d + (u*y - v*x) * e)};
}

function kml_regular_polygon(longitude,latitude,meters,segments,offset){
    var s = '<Polygon>\n';
    s += '  <outerBoundaryIs><LinearRing><coordinates>\n';
    var pts = spoints(longitude,latitude,meters,segments,offset);
    var len = pts.length;
    for(i=0;i<len;i++){
        s += "    " + pts[i].longitude + "," + pts[i].latitude + "\n";
    }

    s += '  </coordinates></LinearRing></outerBoundaryIs>\n';
    s += '</Polygon>\n';
    return s;
}

function kml_ring_with_placeMark(longitude,latitude,meters,segments,offset,name,description){
    var s = '<Placemark>';
        s+='<name>' + name + '</name>\n';
        s+='<description>'+ description + '</description>'
        s+=kml_regular_polygon(longitude,latitude,meters,segments,offset);
        s+='</Placemark>';
    return s;
}

function kml_header(documentName){
    var s='<?xml version="1.0" encoding="UTF-8"?>';
    s+='<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">';
    s+='<Document>';
    s+='<name>'+ documentName+'</name>';
    return s;
}

function kml_footer(){
    return '</Document></kml>';
}