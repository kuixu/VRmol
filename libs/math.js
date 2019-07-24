var vec2 = {
    init : function () {
        return [ 0, 0 ];
    },
    negate : function(A) {
        return [ -A[0], -A[1] ];
    },
    len : function ( A ) {
        return Math.sqrt(A[0]*A[0]+A[1]*A[1]);
    },
    setlen : function(len, A) {
        return this.scalar(len, this.unit(A));
    },
    scalar : function(k, A) {
        return [ k*A[0], k*A[1] ];
    },
    unit : function ( A ) {
        var len = this.len(A);
        return len > Number.EPSILON ? this.scalar(1/len, A) : [0, 0];
    }
}
var vec3 = {
    init : function() {
        return [ 0, 0, 0 ];
    },
    negate : function(A) {
        return [ -A[0], -A[1], -A[2] ];
    },
    plus : function(A, B) {
        return [ A[0]+B[0], A[1]+B[1], A[2]+B[2] ];
    },
    minus : function(A, B) {
        return [ A[0]-B[0], A[1]-B[1], A[2]-B[2] ];
    },
    point : function(A, B) {
        return vec3.minus(B, A);
    },
    scalar : function(k, A) {
        return [ k*A[0], k*A[1], k*A[2] ];
    },
    dot : function(A, B) {
        return A[0]*B[0]+A[1]*B[1]+A[2]*B[2];
    },
    cross : function(A, B) {
        return [ A[1]*B[2]-A[2]*B[1], A[2]*B[0]-A[0]*B[2], A[0]*B[1]-A[1]*B[0] ];
    },
    x : function ( A, B ) {
        return [ A[0]*B[0], A[1]*B[1], A[2]*B[2] ];
    },
    len : function(A) {
        return Math.sqrt(A[0]*A[0]+A[1]*A[1]+A[2]*A[2]);
    },
    setlen : function(len, A) {
        return this.scalar(len, this.unit(A));
    },
    dist : function(A, B) {
        return this.len(this.minus(A, B));
    },
    mid : function(A, B) {
        return this.scalar(0.5, this.plus(A, B));
    },
    average : function ( Vs ) {
        var x = y = z = 0, len = Vs.length;
        if ( len ) {
            Vs.forEach(function(V) { x += V[0]; y += V[1]; z += V[2]; });
            return [ x / len, y / len, z / len ];
        } else {
            return null;
        }
    },
    cos : function ( A, B, unitized ) {
        return unitized ? this.dot(A, B) : ( this.dot(A, B) / this.len(A) / this.len(B) );
    },
    rad : function(A, B, unitized) {
        var cos_AB = unitized ? this.dot(A, B) : ( this.dot(A, B) / this.len(A) / this.len(B) );
        return Math.acos(math.clamp(cos_AB, [-1, 1]));
    },
    unit : function(A) {
        var len = this.len(A);
        return len > Number.EPSILON ? this.scalar(1/len, A) : [0, 0, 0];
    },
    step : function(t, A, B) {
        return this.plus(this.scalar(1-t, A), this.scalar(t, B));
    }
}

var mat4 = {
    init : function() {
        return [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ];
    },
    diag : function(n) {
        return [ n,0,0,0, 0,n,0,0, 0,0,n,0, 0,0,0,n ];
    },
    x : function(A, B) {
        var M = [];
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                M[i+4*j] = A[i]*B[4*j] + A[i+4]*B[4*j+1] + A[i+8]*B[4*j+2] + A[i+12]*B[4*j+3];
            }
        }
        return M;
    },
    transpose : function(A) {
        return [ A[0], A[4], A[ 8], A[12],
                 A[1], A[5], A[ 9], A[13],
                 A[2], A[6], A[10], A[14],
                 A[3], A[7], A[11], A[15] ];
    },
    invert : function(A) {
        var M = [];
    
        M[ 0] =   A[ 5]*A[10]*A[15] - A[ 5]*A[11]*A[14] - A[ 9]*A[ 6]*A[15]
                + A[ 9]*A[ 7]*A[14] + A[13]*A[ 6]*A[11] - A[13]*A[ 7]*A[10];
        M[ 4] = - A[ 4]*A[10]*A[15] + A[ 4]*A[11]*A[14] + A[ 8]*A[ 6]*A[15]
                - A[ 8]*A[ 7]*A[14] - A[12]*A[ 6]*A[11] + A[12]*A[ 7]*A[10];
        M[ 8] =   A[ 4]*A[ 9]*A[15] - A[ 4]*A[11]*A[13] - A[ 8]*A[ 5]*A[15]
                + A[ 8]*A[ 7]*A[13] + A[12]*A[ 5]*A[11] - A[12]*A[ 7]*A[ 9];
        M[12] = - A[ 4]*A[ 9]*A[14] + A[ 4]*A[10]*A[13] + A[ 8]*A[ 5]*A[14]
                - A[ 8]*A[ 6]*A[13] - A[12]*A[ 5]*A[10] + A[12]*A[ 6]*A[ 9];
    
        M[ 1] = - A[ 1]*A[10]*A[15] + A[ 1]*A[11]*A[14] + A[ 9]*A[ 2]*A[15]
                - A[ 9]*A[ 3]*A[14] - A[13]*A[ 2]*A[11] + A[13]*A[ 3]*A[10];
        M[ 5] =   A[ 0]*A[10]*A[15] - A[ 0]*A[11]*A[14] - A[ 8]*A[ 2]*A[15]
                + A[ 8]*A[ 3]*A[14] + A[12]*A[ 2]*A[11] - A[12]*A[ 3]*A[10];
        M[ 9] = - A[ 0]*A[ 9]*A[15] + A[ 0]*A[11]*A[13] + A[ 8]*A[ 1]*A[15]
                - A[ 8]*A[ 3]*A[13] - A[12]*A[ 1]*A[11] + A[12]*A[ 3]*A[ 9];
        M[13] =   A[ 0]*A[ 9]*A[14] - A[ 0]*A[10]*A[13] - A[ 8]*A[ 1]*A[14]
                + A[ 8]*A[ 2]*A[13] + A[12]*A[ 1]*A[10] - A[12]*A[ 2]*A[ 9];
    
        M[ 2] =   A[ 1]*A[ 6]*A[15] - A[ 1]*A[ 7]*A[14] - A[ 5]*A[ 2]*A[15]
                + A[ 5]*A[ 3]*A[14] + A[13]*A[ 2]*A[ 7] - A[13]*A[ 3]*A[ 6];
        M[ 6] = - A[ 0]*A[ 6]*A[15] + A[ 0]*A[ 7]*A[14] + A[ 4]*A[ 2]*A[15]
                - A[ 4]*A[ 3]*A[14] - A[12]*A[ 2]*A[ 7] + A[12]*A[ 3]*A[ 6];
        M[10] =   A[ 0]*A[ 5]*A[15] - A[ 0]*A[ 7]*A[13] - A[ 4]*A[ 1]*A[15]
                + A[ 4]*A[ 3]*A[13] + A[12]*A[ 1]*A[ 7] - A[12]*A[ 3]*A[ 5];
        M[14] = - A[ 0]*A[ 5]*A[14] + A[ 0]*A[ 6]*A[13] + A[ 4]*A[ 1]*A[14]
                - A[ 4]*A[ 2]*A[13] - A[12]*A[ 1]*A[ 6] + A[12]*A[ 2]*A[ 5];
    
        M[ 3] = - A[ 1]*A[ 6]*A[11] + A[ 1]*A[ 7]*A[10] + A[ 5]*A[ 2]*A[11]
                - A[ 5]*A[ 3]*A[10] - A[ 9]*A[ 2]*A[ 7] + A[ 9]*A[ 3]*A[ 6];
        M[ 7] =   A[ 0]*A[ 6]*A[11] - A[ 0]*A[ 7]*A[10] - A[ 4]*A[ 2]*A[11]
                + A[ 4]*A[ 3]*A[10] + A[ 8]*A[ 2]*A[ 7] - A[ 8]*A[ 3]*A[ 6];
        M[11] = - A[ 0]*A[ 5]*A[11] + A[ 0]*A[ 7]*A[ 9] + A[ 4]*A[ 1]*A[11]
                - A[ 4]*A[ 3]*A[ 9] - A[ 8]*A[ 1]*A[ 7] + A[ 8]*A[ 3]*A[ 5];
        M[15] =   A[ 0]*A[ 5]*A[10] - A[ 0]*A[ 6]*A[ 9] - A[ 4]*A[ 1]*A[10]
                + A[ 4]*A[ 2]*A[ 9] + A[ 8]*A[ 1]*A[ 6] - A[ 8]*A[ 2]*A[ 5];
    
        var det = A[0]*M[0] + A[1]*M[4] + A[2]*M[8] + A[3]*M[12];
        if( math.equal(det, 0) ) {
            det = 1 / det;
            for (var i = 0; i < 16; i++) {
                M[i] *= det;
            }
        }

        return M;
    },
    /* pan, zoom, trackball, rotate, orbit, model, view, project
       => will return a matrix to do these action, rather than do these action to a matrix.
       => remember mat4 is a collection of functions, not a data type. */
    pan : function(Tx, Ty, Tz) {
        return [ 1,0,0,0, 0,1,0,0, 0,0,1,0, Tx,Ty,Tz,1 ];
    },
    zoom : function(S) {
        return [ S, 0, 0, 0,
                 0, S, 0, 0,
                 0, 0, S, 0,
                 0, 0, 0, 1 ];
    },
    rotate : function(Rx, Ry, Rz) {
        var sin_x = Math.sin(Rx), cos_x = Math.cos(Rx),
            sin_y = Math.sin(Ry), cos_y = Math.cos(Ry),
            sin_z = Math.sin(Rz), cos_z = Math.cos(Rz);
        return [  cos_y*cos_z,  sin_x*sin_y*cos_z+cos_x*sin_z, -cos_x*sin_y*cos_z+sin_x*sin_z, 0,
                 -cos_y*sin_z, -sin_x*sin_y*sin_z+cos_x*cos_z,  cos_x*sin_y*sin_z+sin_x*cos_z, 0,
                        sin_y,                   -sin_x*cos_y,                    cos_x*cos_y, 0,
                            0,                              0,                              0, 1 ];
    },
    trackball : function(dx, dy) {
        var sin_x = Math.sin(dx), cos_x = Math.cos(dx),
            sin_y = Math.sin(dy), cos_y = Math.cos(dy);
        return [ cos_y,  sin_x*sin_y,  -cos_x*sin_y,  0,
                     0,        cos_x,         sin_x,  0,
                 sin_y, -sin_x*cos_y,   cos_x*cos_y,  0,
                     0,            0,             0,  1 ];
    },
    orbit : function ( axis, theta ) {
        var dx = axis[0], dy = axis[1], dz = axis[2], sin = Math.sin(theta), cos = Math.cos(theta);
        return [    cos+(1-cos)*dx*dx, (1-cos)*dx*dy+dz*sin, (1-cos)*dx*dz-dy*sin, 0,
                 (1-cos)*dx*dy-dz*sin,    cos+(1-cos)*dy*dy, (1-cos)*dy*dz+dx*sin, 0,
                 (1-cos)*dx*dz+dy*sin, (1-cos)*dy*dz-dx*sin,    cos+(1-cos)*dz*dz, 0,
                                    0,                    0,                    0, 1 ];
    },
    model : function () {
        return this.diag(1);
    },
    view : function ( eye, at, up ) {
        var w = vec3.unit(vec3.minus(eye, at)),
            u = vec3.unit(vec3.cross(up, w)),
            v = vec3.cross(w, u);
        return [  u[0],              v[0],              w[0],             0,
                  u[1],              v[1],              w[1],             0,
                  u[2],              v[2],              w[2],             0,
                 -vec3.dot(u, eye), -vec3.dot(v, eye), -vec3.dot(w, eye), 1 ];
    },
    project : function ( fovy, aspect, near, far ) {
        var loc = 1 / Math.tan(fovy/2);
        return [ loc/aspect, 0,   0,                        0,
                 0,          loc, 0,                        0,
                 0,          0,   (near+far)/(near-far),   -1,
                 0,          0,   (2*near*far)/(near-far),  0 ];
    },
    xvec3 : function ( mat, vec ) {
        return [
            mat[0]*vec[0] + mat[4]*vec[1] + mat[ 8]*vec[2],
            mat[1]*vec[0] + mat[5]*vec[1] + mat[ 9]*vec[2],
            mat[2]*vec[0] + mat[6]*vec[1] + mat[10]*vec[2]
        ];
    },
    x4points : function(M, p0, p1, p2, p3) {
        // mat44 x mat 43
        var P = [ p0[0],p1[0],p2[0],p3[0], p0[1],p1[1],p2[1],p3[1], p0[2],p1[2],p2[2],p3[2], 0,0,0,0 ],
            C = this.x(M, P);
        return [ [ C[0],C[4],C[8] ], [ C[1],C[5],C[9] ], [ C[2],C[6],C[10] ], [ C[3],C[7],C[11] ] ];
    },
}

var mat3 = {
    x : function(A, B) {
        var M = [];
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                M[i+3*j] = A[i]*B[3*j] + A[i+3]*B[3*j+1] + A[i+6]*B[3*j+2];
            }
        }
        return M;
    },
    x3points : function(M, p0, p1, p2) {
        // mat33 x mat33
        var P = [ p0[0],p1[0],p2[0], p0[1],p1[1],p2[1], p0[2],p1[2],p2[2] ],
            C = this.x(M, P);
        return [ [ C[0],C[3],C[6] ], [ C[1],C[4],C[7] ], [ C[2],C[5],C[8] ] ];
    }
}

var math = {
    rad2radian : function ( rad ) {
        return ( rad / Math.PI ).toFixed(4) + ' π';
    },
    rad2degree : function ( rad ) {
        var angle = rad / Math.PI * 180,
            angle_i = Math.floor(angle),
            angle_f = Math.floor((angle - angle_i) * 60);
        return angle_i + '°' + angle_f + "'";
    },
    degree2rad : function ( degree ) {
        return Math.PI * degree / 180;
    },
    step : function ( t, a, b ) {
        return ( 1 - t ) * a + t * b;
    },
    percent : function ( n, range ) {
        return range[0] == range[1] ? ( n < range[0] ? 0 : 1 ) 
                                    : this.clamp( ( n - range[0] ) / ( range[1] - range[0] ), 0, 1);
    },
    clamp : function(n, range) {
        return n < range[0] ? range[0] : ( n > range[1] ? range[1] : n );
    },
    limit : function ( n, lmt ) {  // if n out of range, expand range
        if ( typeof lmt[1] == 'undefined' || n > lmt[1] ) {
            lmt[1] = n;
        } else if ( typeof lmt[0] == 'undefined' || n < lmt[0] ) {
            lmt[0] = n;
        }
    },
    average : function ( n, avg ) {
        avg[0] = avg[0] + ( n - avg[0] ) / ( ++avg[1] );
    },
    equal : function(a, b) {
        return Math.abs(a-b) < Number.EPSILON ? true : false;
    },
    overlap : function(A, B) {
        return this.equal(A[0], B[0]) && this.equal(A[1], B[1]) && this.equal(A[2], B[2])
    },
    det_3 : function ( D ) {
        if ( D.length != 9 ) {
            return false;
        }
        return   D[0]*D[4]*D[8] + D[1]*D[5]*D[6] + D[2]*D[3]*D[7]
               - D[0]*D[5]*D[7] - D[1]*D[3]*D[8] - D[2]*D[4]*D[6];
    },
    linear_equation_3 : function ( A, B, C, D ) {  //  Ax + By + Cz = D
        var K = this.det_3([ A[0], B[0], C[0],
                             A[1], B[1], C[1],
                             A[2], B[2], C[2] ]),
            X = this.det_3([ D[0], B[0], C[0],
                             D[1], B[1], C[1],
                             D[2], B[2], C[2] ]),
            Y = this.det_3([ A[0], D[0], C[0],
                             A[1], D[1], C[1],
                             A[2], D[2], C[2] ]),
            Z = this.det_3([ A[0], B[0], D[0],
                             A[1], B[1], D[1],
                             A[2], B[2], D[2] ]);
        return [ X / K, Y / K, Z / K ];
    },
    polysum : function(K, A) { // [ k0, k1, ..., kn ], [ [A0], ... ]
        var out  = [],
            n    = Math.min( K.length, A.length ),
            m    = A[0].length;
        for(var i = 0; i < m; i++) {
            out[i] = 0;
            for(var ii = 0; ii < n; ii++) {
                out[i] += K[ii] * A[ii][i];
            }
        }
        return out;
    },
    shadow : function ( e1, e2, v, tan ) {
        // V + kT = aE1 + bE2  ==>  E1a + E2b - Tk = V
        var tan = w3m_isset(tan) ? tan : vec3.cross(e1, e2),
            abk = this.linear_equation_3(e1, e2, tan, v);
        return vec3.unit( this.polysum( [ abk[0], abk[1] ], [ e1, e2 ] ) );
    },
    dihedral_angle : function ( pA, pB, pC, pD ) {
        var uAB = vec3.unit(vec3.point(pA, pB)),
             AC = vec3.point(pA, pC), HC = vec3.minus(AC, vec3.scalar(vec3.dot(AC, uAB), uAB)),
             AD = vec3.point(pA, pD), HD = vec3.minus(AD, vec3.scalar(vec3.dot(AD, uAB), uAB)),
            xyz = vec3.plus( vec3.mid(pA, pB), vec3.plus(vec3.unit(HC), vec3.unit(HD)) );
        return [ vec3.rad(HC, HD), xyz ];
    },
    triangle_area : function ( A, B, C ) {
        var a = vec3.dist(B, C),
            b = vec3.dist(A, C),
            c = vec3.dist(A, B),
            p = 0.5 * ( a + b + c );
        return Math.sqrt(p*(p-a)*(p-b)*(p-c));
    },
    fit : function(n, c) { // c : array of ctrl points; n : num of interpolating
        var out = [];
        for(var i = 0; i <= n; i++) {
            var ubase = i / n,
                u     = [1],
                d     = [0]; // dp/du
            var dd    = [0, 0, 2, 6*ubase]; // d2p/du2
            for(var j = 1, l = c.length; j < l; j++) {
                u[j]  = u[j-1] * ubase;
                d[j]  = u[j-1] * j;
            }
            out[i] = [ this.polysum(u, c), this.polysum(d, c), this.polysum(dd, c) ];
        }
        return out;
    },
    lineFit : function(n, p0, p1) {
        var c = [ p0, vec3.point(p0, p1) ];
        return this.fit(n, c);
    },
    quadFit : function(n, p0, p1, p2) { // 0, 0.5, 1
        var mat = [ 1,-3,2, 0,4,-4, 0,-1,2 ],
            c = mat3.x3points(mat, p0, p1, p2);
        return this.fit(n, c);
    },
    cubeFit : function(n, p0, p1, p2, p3) { // 0, 1/3, 2/3, 1
        var mat = [ 1,-5.5,9,-4.5, 0,9,-22.5,13.5, 0,-4.5,18,-13.5, 0,1,-4.5,4.5 ],
            c = mat4.x4points(mat, p0, p1, p2, p3);
        return this.fit(n, c);
    },
    cubeFit4parts : function(n, p0, p1, p2, p3) { // 0, 0.25, 0.75, 1
        var mat = [ 1,-6.33,10.67,-5.33, 0,8,-18.67,10.67, 0,-2.67,13.33,-10.67, 0,1,-5.33,5.33 ];
            c = mat4.x4points(mat, p0, p1, p2, p3);
        return this.fit(n, c);
    },
    hermiteFit : function(n, p0, p3, dp0, dp3) {
        var mat = [ 1,0,-3,2, 0,0,3,-2, 0,1,-2,1, 0,0,-1,1 ];
            c = mat4.x4points(mat, p0, p3, dp0, dp3);
        return this.fit(n, c);
    }
}