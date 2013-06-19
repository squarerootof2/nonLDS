/*
file: main.js
contributers: Austin Packer

main() goes here at the bottom of the file.
As well as all the functions used in main()

*/

"use strict";

function drawPoint(ctx, px, py, radius)
{
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.closePath();
    //ctx.stroke();
}


// Main part of program
function runSystem(ctx, state, r1, r2, skip, numberOfPoints, slices, dx, radius, ctxHeight, border, scale)
{
    var s;
	var slice;
	var r;
	var dr = (r2 -r1) / slices;
	for (r = r1, slice = 1; r < r2 && slice < slices; r += dr, slice++)
	{
		//don't plot the first skip points
		s = state;
		for (var i = 1; i < skip; i++)
		{
			s = r * (1 - s) * s; // quadratic map
		}

		//now take s and plot numOfPnts points
		for (var j = 1; j < numberOfPoints; j++)
		{
			s = r * (1 - s) * s; // quadratic map
			drawPoint(ctx, (slice*dx + border), (ctxHeight - border - (s*scale)), radius);
		}
        ctx.stroke();
	}
}


function drawLine(px1, py1, px2, py2, ctx)
{
	ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(px1, py1);
	ctx.lineTo(px2, py2);
	ctx.closePath();
	ctx.stroke();
}


function drawAxes(ctx, ctxWidth, ctxHeight, border)
{
    drawLine(border, border, border, (ctxHeight - border), ctx); // vertical axis
    drawLine(border, (ctxHeight - border), (ctxWidth - border), (ctxHeight - border), ctx); // horizontal axis
}


function drawLabel(label, px, py, ctx)
{
	ctx.fillStyle = "#000000";	
	ctx.strokeStyle = "#000000";
    ctx.font="15px Arial";
	ctx.fillText(label, px, py);
}


function drawLabels(ctx, ctxWidth, ctxHeight, r1, r2, border, scale)
{
    drawLabel("0.0", (border-35), (ctxHeight-border), ctx);
	drawLabel("0.25", (border-35), (ctxHeight-border-scale*0.25), ctx);
	drawLabel("0.5", (border-35), (ctxHeight-border-scale*0.5), ctx);
	drawLabel("0.75", (border-35), (ctxHeight-border-scale*0.75), ctx);
	drawLabel("1.0", (border-35), (ctxHeight-border-scale), ctx);
	drawLabel(r1, border, (ctxHeight-10), ctx);
	drawLabel(r2, ctxWidth-border, (ctxHeight-10), ctx);
	drawLabel((r2-r1)*0.25 + r1, ctxWidth*0.25, ctxHeight-10, ctx);
	drawLabel((r1+r2)*0.5, ctxWidth*0.5, ctxHeight-10, ctx);
	drawLabel((r2-r1)*0.75 + r1, ctxWidth*0.75, ctxHeight-10, ctx);
}


function main()
{

	// get the canvas element using the DOM
	var canvas = document.getElementById('myCanvas');

	// Make sure we don't execute when canvas isn't supported
	if (canvas.getContext)
	{
        /// INITIALIZE ALL VARIABLES HERE ///
        
		var numberOfPoints = document.getElementById('iterations').value - 0;
		var ctx = canvas.getContext('2d');
        var ctxWidth = canvas.width;
		var ctxHeight = canvas.height;
        var state = document.getElementById('initialState').value - 0;
        var r1 = document.getElementById('R1').value - 0;
		var r2 = document.getElementById('R2').value - 0;
		var slices = document.getElementById('slices').value - 0;
        var skip = document.getElementById('skip').value - 0;
        
        var radius = document.getElementById('radius').value - 0;
        var border = 40; // number of pixels around the graph.

        var graphWidth = ctxWidth - (2 * border); // make room for axes and labels.
        var graphHeight = ctxHeight - (2 * border);
        var dx = (graphWidth / slices);

		
		// Draw stuff
		if (r1 < r2)
		{
			ctx.clearRect(0, 0, ctxWidth, ctxHeight);
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(0, 0, ctxWidth, ctxHeight);

			drawAxes(ctx, ctxWidth, ctxHeight, border);
			drawLabels(ctx, ctxWidth, ctxHeight, r1, r2, border, graphHeight);
            
            var start = new Date();
            
			runSystem(ctx, state, r1, r2, skip, numberOfPoints, slices, dx, radius, ctxHeight, border, graphHeight);
            
            var finish = new Date();
            var difference = new Date();
            difference.setTime(finish.getTime() - start.getTime());
            var timeLapse = difference.getSeconds();
            
            drawLabel("number of slices: "+slices, 50, 15, ctx);
            drawLabel("points to plot: "+numberOfPoints, 50, 35, ctx);
            drawLabel("points to skip: "+skip, 50, 55, ctx);
            drawLabel("graphWidth: "+graphWidth, 50, 75, ctx);
            drawLabel("graphHeight: "+graphHeight, 50, 95, ctx);
            drawLabel("ctxWidth: "+ctxWidth, 50, 115, ctx);
            drawLabel("ctxHeitht: "+ctxHeight, 50, 135, ctx);
            
            drawLabel("lineWidth: "+ctx.lineWidth, 222, 15, ctx);
            drawLabel("radius: "+radius, 222, 35, ctx);
            drawLabel("border: "+border, 222, 55, ctx);
            drawLabel("R1: "+r1, 222, 75, ctx);
            drawLabel("R2: "+r2, 222, 95, ctx);
            drawLabel("time: "+timeLapse+" sec", 222, 115, ctx);
            
            // save canvas image as data url (png format by default)
            var dataURL = canvas.toDataURL();

            window.open(dataURL);
            
            // set canvasImg image src to dataURL
            // so it can be saved as an image
            //document.getElementById('canvasImg').src = dataURL;
        }
		else
		{
			alert("error: r1 should be less than r2");
		}
    } 
	else 
	{
        alert('You need google chrome.');
    }
}


