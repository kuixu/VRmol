# Tutorial: Intro to iNano

<!--we can see these two websites-->

<!--for content, we can reference to Web3DMol at https://web3dmol.net/help.html -->



<!--for html style, we can reference to  https://reactjs.org/tutorial/tutorial.html -->





## Before We Start the Tutorial

Welcome to the iNano Tutorial. The following pages will take you on a brief self-guided tour of the structure visualization and integrative analysis abilities in Virtual Reality of the iNano. We will show a model with all if options in iNano during this tutorial. It will give you a deep understanding of iNano.

The tutorial is divided into two sections:

- [Introduction](https://reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial) will give you **a starting point** to follow the tutorial.
- [Overview](https://reactjs.org/tutorial/tutorial.html#overview) will teach you the fundamentals of iNano: functions and features.
- [VR Mode](https://reactjs.org/tutorial/tutorial.html#adding-time-travel) will teach you use iNano in Virtual Reality.
- [Desktop Mode](https://reactjs.org/tutorial/tutorial.html#completing-the-game) will teach you use iNano on the desktop.
- [Sharing URL]() will teach you use iNano with a sharing URL which can be embeded into your own webpage with only a single line HTML code.

You don’t have to complete all of the sections at once to get the value out of this tutorial. Try to get as far as you can — even if it’s one or two sections.

It’s fine to copy and paste code as you’re following along the tutorial, but we recommend to try it by hand with VR devices. This will help you develop a muscle memory and a stronger understanding.

## Introduction

iNano, a for molecular structure visualization and integrative analysis. iNano connects to multi-source translational and drug data from the cloud in a fully immersive VR environment. The immersive experience of iNano improves the visualization, calculation, and editing of complex structures. iNano is web-based  system and connects to disease-related and drug databases, and thus can serve as an integrative platform to aid in structure-based translational researches and drug design. iNano is freely available at <https://inano.zhanglab.net>.

- iNano enables users to explore macromolecular structures in virtual reality from a web browser.
- iNano provides a cloud-based platform to access multiple resources for integrated structural studies.


## Overview

![fg1](figs/fg1.png)

## VR Mode 

### Screen shot
![Screen shot](figs/vr/screenshot.png)

video
![video](figs/vr/video-1.mp4)


### Menu

![vr_menu](figs/vr_menu.png)



### Representation

iNano provide different representation modes, which can be changed in "Main Structure" in the menu.

- **Line**

  ![Representation_1](figs\vrl\Representation_1.png)

- **Backbone**

  ![Representation_2](figs\vr\Representation_2.png)

- **Sphere**

  ![Representation_3](figs\vr\Representation_3.png)

- **Stick**

  ![Representation_4](figs\vr\Representation_4.png)

- **Ball & Rod**

  ![Representation_5](figs\vr\Representation_5.png)

- **Tube**

  ![Representation_6](figs\vr\Representation_6.png)

- **Ribbon-flat**

  ![Representation_7](figs\vr\Representation_7.png)

- **Ribbon-ellipse**

  ![Representation_12](figs\vr\Representation_12.png)

- **Ribbon-rectangle**

  ![Representation_8](figs\vr\Representation_8.png)

- **Ribbon-strip**

  ![Representation_9](figs\vr\Representation_9.png)

- **Ribbon-railway**

  ![Representation_10](figs\vr\Representation_10.png)

- **Ribbon-SS**

  ![Representation_11](figs\vr\Representation_11.png)

#### Ligand

iNano shows ligand with main structure or separately.

 ![ligand_ball&rod](figs\vr\ligand_ball&rod.png)

 ![ligand_line](figs\vr\ligand_line.png)

 ![ligand_sphere](figs\vr\ligand_sphere.png)

 ![ligand_stick](figs\vr\ligand_stick.png)

#### Water

#### Surface

iNano provides different mode and transparency for structure surfaces. Surface includes Van der Waals surface, solvent accessible surface, solvent excluded surface and molecular surface.
![surface_1](figs\vr\surface_1.png)
![surface_2](figs\vr\surface_2.png)
![surface_3](figs\vr\surface_3.png)
![surface_4](figs\vr\surface_4.png)
![surface_5](figs\vr\surface_5.png)
![surface_6](figs\vr\surface_6.png)
![surface_7](figs\vr\surface_7.png)


### Color Schema

![color_1](figs\vr\color_1_element.png) ![color_2](figs\vr\color_2_resi.png) ![color_3](figs\vr\color_3_second_stru.png)


### Computing the distance in VR
![vr_menu](figs/vr/distance.png)
### Structure Editing

### Fragmentation

Users need to choose the region and representation style in panel.

![fragment_1](figs/vr/fragment_1.png)

Here is an example:

![fragment_2](figs/vr/fragment_2.png)



### Mutating a Residue

### Visualize Genome Variations
![mutation](figs/mutation.png)
### Drugs

![image-20190124155108857](figs/drug.png)

### Interactive Docking
![image-20190124155039841](figs/docking-results.png)
![image-20190124155039841](figs/docking.png)

### Density Map

![density_map](figs/density_map.png)
### Spherical View
![image-20190124155039841](figs/vr/spherical_view1.png)
![image-20190124155039841](figs/vr/spherical_view2.png)

### Speech Recognition

Button for speech recognition is located at the top-left of the page.

![Speech_recognition_1](figs/Speech_recognition_1.png)

Steps for Speech Recognition:

1. Choose a language. The default language is English.
2. Press down the button.
3. Hold down the button while speaking the command.
4. Release the button. The recording will finish and uploaded to server automatically.
5. Wait a few seconds (depending on the length of recording and network conditions), after the recognition is completed, iNano will operate according to the voice command.

#### Language

iNano now support both English and Chinese speech recognition.  Users could first click the "Speech" item in the menu, then choose the language by clicking the option.

![Speech_recognition_2](figs/Speech_recognition_2.png)

#### Command List

<table>
   <tr>
      <td>Category</td>
      <td>Command</td>
   </tr>
   <tr>
      <td rowspan="3">Visualization Mode</td>
      <td>go to desktop mode</td>
   </tr>
   <tr>
      <td>go to virtual reality mode</td>
   </tr>
   <tr>
      <td>go to travel mode</td>
   </tr>
   <tr>
      <td rowspan="10">Main structure style</td>
      <td>change to dot style</td>
   </tr>
   <tr>
      <td>change to line style</td>
   </tr>
   <tr>
      <td>change to backbone style</td>
   </tr>
   <tr>
      <td>change to sphere style</td>
   </tr>
   <tr>
      <td>change to stick style</td>
   </tr>
   <tr>
      <td>change to ball and rod style</td>
   </tr>
   <tr>
      <td>change to tube style</td>
   </tr>
   <tr>
      <td>change to second structure style</td>
   </tr>
   <tr>
      <td>hide main structure</td>
   </tr>
   <tr>
      <td>show main structure</td>
   </tr>
   <tr>
      <td rowspan="6">Ligand structure style</td>
      <td>change Ligand to line style</td>
   </tr>
   <tr>
      <td>change Ligand to sphere style</td>
   </tr>
   <tr>
      <td>change Ligand to stick style</td>
   </tr>
   <tr>
      <td>change Ligand to ball and rod style</td>
   </tr>
   <tr>
      <td>hide ligand structure</td>
   </tr>
   <tr>
      <td>show ligand structure</td>
   </tr>
   <tr>
      <td rowspan="6">Other</td>
      <td>show water </td>
   </tr>
   <tr>
      <td>hide water</td>
   </tr>
   <tr>
      <td>show hydrogen bond</td>
   </tr>
   <tr>
      <td>hide hydrogen bond</td>
   </tr>
   <tr>
      <td>show mutation</td>
   </tr>
   <tr>
      <td>hide mutation</td>
   </tr>
   <tr>
      <td rowspan="4">Surface</td>
      <td>show the surface of main structure</td>
   </tr>
   <tr>
      <td>show transparency</td>
   </tr>
   <tr>
      <td>show mesh</td>
   </tr>
   <tr>
      <td>hide the surface of main structure</td>
   </tr>
   <tr>
      <td rowspan="8">Color</td>
      <td>color by element</td>
   </tr>
   <tr>
      <td>color by residue</td>
   </tr>
   <tr>
      <td>color by second structure</td>
   </tr>
   <tr>
      <td>color by chain</td>
   </tr>
   <tr>
      <td>color by b-factor</td>
   </tr>
   <tr>
      <td>color by spectrum</td>
   </tr>
   <tr>
      <td>color by hydrophobicity</td>
   </tr>
   <tr>
      <td>color by conservation</td>
   </tr>
   <tr>
      <td rowspan="14">Interaction</td>
      <td>open dragging function</td>
   </tr>
   <tr>
      <td>open labelling function</td>
   </tr>
   <tr>
      <td>rotation</td>
   </tr>
   <tr>
      <td>rotation by x</td>
   </tr>
   <tr>
      <td>rotation by y</td>
   </tr>
   <tr>
      <td>rotation by z</td>
   </tr>
   <tr>
      <td>clockwise rotation</td>
   </tr>
   <tr>
      <td>anticlockwise rotation</td>
   </tr>
   <tr>
      <td>move</td>
   </tr>
   <tr>
      <td>move along x</td>
   </tr>
   <tr>
      <td>move along y</td>
   </tr>
   <tr>
      <td>move along z</td>
   </tr>
   <tr>
      <td>move forward</td>
   </tr>
   <tr>
      <td>move backward</td>
   </tr>
</table>

### Supported Devices



## Desktop Mode Browser Support 



https://threejs.org/docs/index.html#manual/en/introduction/Browser-support

https://caniuse.com/#feat=webgl



### Representation

iNano provide 13 different representation mode, which can be changed in "Main Structure" in the menu.

![Representation_1](figs\Representation_1.png)

- **Dot**

  ![Representation_4](figs\Representation_4.png)

- **Line**

  ![Representation_3](figs\Representation_3.png)

- **Backbone**

  ![Representation_5](figs\Representation_5.png)

- **Sphere**

  ![Representation_6](figs\Representation_6.png)

- **Stick**

  ![Representation_7](figs\Representation_7.png)

- **Ball & Rod**

  ![Representation_8](figs\Representation_8.png)

- **Tube**

  ![Representation_9](figs\Representation_9.png)

- **Ribbon-flat**

  ![Representation_10](figs\Representation_10.png)

- **Ribbon-ellipse**

  ![Representation_11](figs\Representation_11.png)

- **Ribbon-rectangle**

  ![Representation_12](figs\Representation_12.png)

- **Ribbon-strip**

  ![Representation_13](figs\Representation_13.png)

- **Ribbon-railway**

  ![Representation_14](figs\Representation_14.png)

- **Ribbon-SS**

  ![Representation_15](figs\Representation_15.png)

#### Ligand

iNano shows ligand with main structure or separately.

![ligand_1](figs\ligand_1.png)

![ligand_2](figs\ligand_2.png)

For ligand, iNano provides 4 styles.

- **Line**

  ![ligand_3](figs\ligand_3.png)

- **Sphere**

  ![ligand_4](figs\ligand_4.png)

- **Stick**

  ![ligand_5](figs\ligand_5.png)

- **Ball & Rod**

  ![ligand_6](figs\ligand_6.png)

#### Water

#### Surface

iNano provides different mode and transparency for structure surfaces. Surface includes Van der Waals surface, solvent accessible surface, solvent excluded surface and molecular surface.

![surface_1](figs\surface_1.png)
![surface_2](figs\surface_2.png)
![surface_3](figs\surface_3.png)
![surface_4](figs\surface_4.png)
![surface_5](figs\surface_5.png)
![surface_6](figs\surface_6.png)
![surface_7](figs\surface_7.png)
![surface_8](figs\surface_8.png)

### Color Schema

![color_1](figs\color_1.png)
![color_2](figs\color_2.png)
![color_3](figs\color_3.png)
![color_4](figs\color_4.png)
![color_5](figs\color_5.png)
![color_6](figs\color_6.png)
![color_7](figs\color_7.png)
![color_8](figs\color_8.png)

### Fragmentation

Fragments are segments of chains in a molecule. iNano allows users to present fragments by using different representation style in 'Region'. 

![fragment_1](D:/le_2018B/%E6%AF%95%E8%AE%BE/git/molwebvr/docs/figs/fragment_1.png)

Users need to choose the region and representation style in panel.

![fragment_2](D:/le_2018B/%E6%AF%95%E8%AE%BE/git/molwebvr/docs/figs/fragment_2.png)

Here is an example:

![fragment_3](D:/le_2018B/%E6%AF%95%E8%AE%BE/git/molwebvr/docs/figs/fragment_3.png)

## Sharing by URL

