# EM Density Map

## Resource

  - http://www.ebi.ac.uk/pdbe/eds
  - http://www.ebi.ac.uk/pdbe/api/doc
  - http://rest.rcsb.org/rest/structures/3dview/6hd1

## CCP4/MRC File Header


Byte Numbers | Id           |Variable Type| Variable Name | Contents |
-------------|:------------:|:-------------:|:--------:|:--------:|
1  -  4|0 |i|NumCol|number of columns (fastest-varying dimension; normally mapped to x)
5  -  8|1 |i|NumRow|number of rows (second fastest-varying dimension; normally mapped to y)
9  - 12|2 |i|NumSections|number of sections (slowest-varying dimension; normally mapped to the remaining dimensions, z, wavelength, and time)
13 - 16|3 |i|PixelType|format of each pixel value (the Pixel Data Types section of the Imsubs reference manual lists the defined options)
17 - 20|4 |i|mxst|index of the first column (normally mapped to x) in the data; zero by default
21 - 24|5 |i|myst|index of the first row (normally mapped to y) in the data; zero by default
25 - 28|6 |i|mzst|index of the first section (normally treated as the first z) in the data; zero by default
29 - 32|7 |i|mx|number of intervals in the fastest-varying direction (normally x)
33 - 36|8 |i|my|number of intervals in the second fastest-varying direction (normally y)
37 - 40|9 |i|mz|number of intervals in the slowest varying direction (normally treated as z)
41 - 44|10 |f|dx|pixel spacing times sampling interval for fastest-varying direction (first cell dimension in Angstroms for crystallographic data)
45 - 48|11 |f|dy|pixel spacing times sampling interval for second fastest-varying direction (second cell dimension in Angstroms for crystallographic data)
49 - 52|12 |f|dz|pixel spacing times sampling interval slowest-varying direction (third cell dimension in Angstroms for crystallographic data)
53 - 56|13 |f|alpha|cell angle (alpha) in degrees; defaults to 90
57 - 60|14 |f|beta|cell angle (beta) in degrees; defaults to 90
61 - 64|15 |f|gamma|cell angle (gamma) in degrees; defaults to 90
65 - 68|16 |i|-|column axis (1 = x, 2 = y, 3 = z; defaults to 1)
69 - 72|17 |i|-|row axis (1 = x, 2 = y, 3 = z; defaults to 2)
73 - 76|18 |i|-|section axis (1 = x, 2 = y, 3 = z; defaults to 3)
77 - 80|19 |f|min|minimum intensity
81 - 84|20 |f|max|maximum intensity
85 - 88|21 |f|mean|mean intensity
89 - 92|22 |i|nspg|space group number (for crystallography; otherwise, 0, 1, or 401)
93 - 96|23 |i|next|extended header size in bytes
97 - 100|24 |c4|extra0|4 byte unused section
101 - 104|25 |i|ntst|starting time index
105 - 128|26 |c24|extra1|24 byte unused section
129 - 130|27 |n|NumIntegers|number of 4 byte integers stored in the extended header per section (Priism extension to Image2000 format)
131 - 132|28 |n|NumFloats|number of 4 byte floating-point numbers stored in the extended header per sectior (Priism extension to Image2000 format)
133 - 134|29 |n|sub|number of sub-resolution data sets stored within the image typically 1; Priism extension to Image2000 format)
135 - 136|30 |n|zfac|reduction quotient for the z axis of the sub-resolution images (Priism extension to Image2000 format)
137 - 160|31 |c24|extra2|24 byte unused section
161 - 162|32 |n|type|image type (the Image Types section of the Imsubs reference manual lists types that have been defined; Priism extension to Image2000 format)
163 - 164|33 |n|LensNum|lens identification number (Priism extension to Image2000 format)
165 - 166|34 |n|n1|depends on the image type (Priism extension to Image2000 format)
167 - 168|35 |n|n2|depends on the image type (Priism extension to Image2000 format)
169 - 170|36 |n|v1|depends on the image type (Priism extension to Image2000 format)
171 - 172|37 |n|v2|depends on the image type (Priism extension to Image2000 format)
173 - 184|38 |c12|extra3|12 byte unused section
185 - 188|39 |f|-|x axis tilt angle (degrees; Priism extension to Image2000 format)
189 - 192|40 |f|-|y axis tilt angle (degrees; Priism extension to Image2000 format)
193 - 196|41 |f|-|z axis tilt angle (degrees; Priism extension to Image2000 format)
197 - 200|42 |f|x0|x origin (microns for optical, Angstroms for EM)
201 - 204|43 |f|y0|y origin (microns for optical, Angstroms for EM)
205 - 208|44 |f|z0|z origin (microns for optical, Angstroms for EM)
209 - 212|45 |c4|map|the character string 'MAP '
213-216|46 |c4|machst|first two bytes are 17 and 17 for big-endian or 68 and 65 for little-endian
217-220|47 |f|rms|RMS deviations of intensities from mean
221 - 224|48 |i|NumTitles|number of titles (valid numbers are between 0 and 10)
225 - 304|49 |c80|-|title 1
305 - 384|50 |c80|-|title 2
385 - 464|51 |c80|-|title 3
465 - 544|52 |c80|-|title 4
545 - 624|53 |c80|-|title 5
625 - 704|54 |c80|-|title 6
705 - 784|55 |c80|-|title 7
785 - 864|56 |c80|-|title 8
865 - 944|57 |c80|-|title 9
945 - 1024|58 |c80|-|title 10




