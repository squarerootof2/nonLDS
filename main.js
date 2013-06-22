/*
file: main.js
contributers: Austin Packer

main() goes here at the bottom of the file.
As well as all the functions used in main()

TODO
add tick marks on axes

*/

"use strict";


// Main part of program
function runSystem(ctx, state, r1, r2, skip, numberOfPoints, slices, dx, radius, ctxHeight, border, scale)
{
    var s;
	var slice;
    var sx;
	var r;
    var ctxHtMinusBorder = ctxHeight - border;
	var dr = (r2 -r1) / slices;

	for (r = r1, slice = 1; r < r2 && slice < slices; r += dr, slice++)
	{
		//don't plot the first skip points
		s = state;
		for (var i = 1; i < skip; i++)
		{
			s = r * (1 - s) * s; // quadratic map
		}

        sx = slice*dx + border;
        
		//now take s and plot numOfPnts points
		for (var j = 1; j < numberOfPoints; j++)
		{
			s = r * (1 - s) * s; // quadratic map
            
            ctx.beginPath();
            ctx.arc(sx, (ctxHtMinusBorder - s*scale), radius, 0, 2 * Math.PI, false);
            ctx.fill();
		}
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "black";
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
    var bot = ctxHeight - border;
    var leftSide = border - 35;
    var y1 = bot - 2;
    var y2 = bot + 3;
    var x1 = border - 2;
    var x2 = border + 3;
    
    drawLabel("0.0", leftSide, bot, ctx);
    drawLine(x1, bot, x2, bot, ctx);
    
	drawLabel("0.25", leftSide, (bot-scale*0.25), ctx);
    drawLine(x1, (bot-scale*0.25), x2, (bot-scale*0.25), ctx);
    
	drawLabel("0.5", leftSide, (bot-scale*0.5), ctx);
    drawLine(x1, (bot-scale*0.5), x2, (bot-scale*0.5), ctx);
    
	drawLabel("0.75", leftSide, (bot-scale*0.75), ctx);
    drawLine(x1, (bot-scale*0.75), x2, (bot-scale*0.75), ctx);
    
	drawLabel("1.0", leftSide, (bot-scale), ctx);
    drawLine(x1, (bot-scale), x2, (bot-scale), ctx);
    
	drawLabel(r1, border, (ctxHeight-10), ctx);
    drawLine(border, y1, border, y2, ctx);
    
	drawLabel(r2, ctxWidth-border, (ctxHeight-10), ctx);
    //drawLine((ctxWidth-border), y1, (ctxWidth-border), y2, ctx);
    
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
        var border = 40.5; // number of pixels around the graph. TODO change how the border is used so that it does not go all the way around.

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
            var mins = difference.getMinutes();
            var secs = difference.getSeconds();
            var millies = difference.getMilliseconds();
            
            drawLabel("points to skip: "+skip,           50, 15, ctx);
            drawLabel("points to plot: "+numberOfPoints, 50, 35, ctx);
            drawLabel("number of slices: "+slices,       50, 55, ctx);
            drawLabel("graphWidth: "+graphWidth,         50, 75, ctx);
            drawLabel("graphHeight: "+graphHeight,       50, 95, ctx);
            
            
            drawLabel("ctxWidth: "+ctxWidth,       225, 15, ctx);
            drawLabel("ctxHeitht: "+ctxHeight,     225, 35, ctx);
            drawLabel("border: "+border,           225, 55, ctx);
            drawLabel("lineWidth: "+ctx.lineWidth, 225, 75, ctx);
            
            drawLabel("time: "+mins+" min,  "+secs+"."+millies+" sec", 400, 15, ctx);
            drawLabel("radius: "+radius, 400, 35, ctx);
            drawLabel("R1: "+r1,         400, 55, ctx);
            drawLabel("R2: "+r2,         400, 75, ctx);
            
            
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


