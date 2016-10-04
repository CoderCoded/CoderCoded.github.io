---
layout: post
title:  "Pepper animation workflow improvement"
subtitle: "A Unity application for controlling robot motion"
date: 2016-10-04 18:00:00
categories: blog
vimeo_id: 185363113
vimeo_url: https://vimeo.com/185363113
---

We had our first encounter with Pepper at [Junction Asia](https://blog.hackjunction.com/hacking-robots-in-japan-a86bc227bfd4) in Tokyo. During the Junction Asia hackathon, we came up with some cool animation ideas for the robot. However, we realized that the default tools used to create animations for Pepper were a bit cumbersome, and there would not be enough time to come up with anything useful at the hackathon. After the hackathon we joined the Pepper developer program and since then we have learned a lot about Pepper and its tools. In this blog entry we talk about our solution to improve Pepper's animation features.

### How animations are created for Pepper

Choregraphe (The Pepper's development environment) has a timeline-based interface with keyframes and curves, similar to common animation programs. However, setting the robot's pose for each keyframe is a slow process. When using a virtual robot, only forward kinematics (FK) are available. Setting values for each of the robot's joints with a mouse is not very practical. A physical robot allows the user to manipulate the robot's joints directly by twisting its arms, for example, but coming up with rich and realistic animations with this method is still very time consuming.

### A human actor to speed-up the process

Professional animation workflows include, for example, motion capturing and blending together pre-recorded animations. Since we had some experience (Juha especially) with Kinect, we had an idea: could we use Kinect to track a human actor and convert the poses for Pepper?

Soon we found out that a guy named [Atsushi Sugiyama](https://github.com/malaybaku/) from Japan had already done [an implementation for Kinect v2](http://www.baku-dreameater.net/archives/3951). As we had a couple of older Kinects (v1) lying around, we tried to use those first with [Unity](https://unity3d.com/), which has assets for real-time motion capture using Kinect. Later on we upgraded to Kinect v2 as v1 has inferior skeletal tracking and noisier output when compared to v2.

The problem with Kinect is the inaccurate tracking of hands and the head. Especially with Pepper, it is very important to track those parts accurately. A motion capture software for Kinect (and for many other devices, too) called [iPi Soft](http://ipisoft.com/) supports PSMove controllers to improve head and hand tracking. This is a very inexpensive solution and fits perfectly to this case. [Here](https://github.com/HipsterSloth/psmove-unity5) is a neat example (made by [HipsterSloth](https://github.com/HipsterSloth)) of using [PS Move API](http://thp.io/2010/psmove/) in Unity. The PS Move API removes the need for a PS console.

### Our solution

We use Kinect v2 to generate a digital skeleton of a human actor. The skeletal data is sent to Unity and used as the skeleton for a humanlike virtual character, roughly the size of Pepper.

We also have a separate virtual model of Pepper. It has all the joints that Pepper has (as they are with their limitations) but not a skeletal humanlike structure. The Pepper model tries to mimic the poses of the virtual character using Inverse Kinematics (IK). This model's joint data is then sent to NaoQI (robot's OS) using UDP.

Choregraphe has tools for recording the motion of the robot (a physical or a virtual one). The recording can then be used as a base for the animation. As can be seen in the video, the system is quite useful already. We use it whenever we need to create custom animations for the robot.
