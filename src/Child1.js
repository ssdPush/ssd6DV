import React, { Component } from "react";
import * as d3 from "d3";
import './Child1.css'

class Child1 extends Component {
  constructor(props){
    super(props)
    this.state = {
      color: "#984ea3",
      mdl: "GPT-4"
    }
  }

  componentDidMount() {

    //test for output
    //console.log("this.state.md") XXXXXXX
    //XXXX
    
    this.render_chart()
  }

  componentDidUpdate() {




    this.render_chart()

  }

  render_chart() {


    const dataPre = this.props.csv_data
        const keysFrMdl = ["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"]
          //order of model keys

    //console.log(dataPre[0]["Date"])
    
    
    var margin = {left: 80, right: 190, top: 0, bottom: 180},
          width = 400,
          height = 400




    const svg = d3.select(".child1").selectAll("svg").data([dataPre]).join("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)


    
    const container = svg.selectAll('.container')
      .data([0])
      .join('g')
      .attr('height', height)
      .attr('width', width)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
    






    // x axis

    /*

    var ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var x = d3.scaleLinear()
    .domain(d3.extent(dataPre, function(d) { return d["Date"].getMonth(); }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    .tickValues(ticks)
    .tickFormat(function(d,i){ return months[i] })
  );

    //y's are each category


    */


    const topofaxis = d3.max(
      dataPre.map(d => d["GPT-4"] + d["Gemini"] + d["PaLM-2"] + d["Claude"] + d["LLaMA-3.1"]));
      const xs = d3.scaleTime().domain(d3.extent(dataPre, d=> d.Date)).range([0, width])

        const ys = d3.scaleLinear().domain([0, topofaxis]).range([height, 0])
    /*
    
    var y = d3.scaleLinear()
    .domain([-290, 290])
    .range([ height, 0 ]);
    

    
  
    var keys = Object.keys(dataPre[0])

    console.log(keys)
    
    var i2r = keys.indexOf("Date")



    console.log(i2r)

    var dt = keys.splice(i2r, (i2r + 1))

    console.log("Updated keys")
    console.log(keys)
        */

    d3.selectAll("svg").selectAll(".x-axis").data(dataPre).join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${margin.left},${height + margin.top + (margin.bottom / 2)})`)
      .call(d3.axisBottom(xs)
      .tickFormat((date) => 
        date.toLocaleString('default', {month:'short'})))



    const colors = d3.scaleOrdinal()
      .domain(["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"])
      .range([ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

    //var dt = keys.splice(i2r, (i2r + 1))


    var stackgen = d3.stack().keys(["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"])
        .offset(d3.stackOffsetWiggle);
    var stackedData = stackgen(dataPre)

    //console.log(stackedData)


    var area = d3.area()
            .x(d => xs(d.data.Date))
            .y0(d => ys(d[0]))
            .y1(d => ys(d[1]))
            .curve(d3.curveCatmullRom.alpha(0.5))
  



    

    
    // Add in tooltip div
    //try joning divs instead of just moving them in with loops?????
    var tooltip = d3.select("body").selectAll(".tooltip").data([0]).join('div').attr('class', "tooltip").style("opacity", [0])


    var legend = svg.selectAll(".legend")
    .data([0]) //first
    .join('g')
    .attr('class', 'legend')
    .attr('height', height / 4)
    .attr('width', width / 6)
    .attr('transform', `translate(${width + margin.left + (margin.right / 2)}, ${( height / 2 ) + margin.top})`)
  
  

  // CREATING LEGEND

  //legend CREATION
      /*
  var con = 35
        while (order.length > 0) {
    var removed = order.pop();
    var rcolor = color(removed)

       console.log(rcolor)
             svg2.append("text").attr("x", 170).attr("y", con+27).text(removed).style("font-size", "10px").attr("alignment-baseline","right")
    svg2.append("rect").attr("height", 15).attr("width", 15).attr("x",150).attr("y",con + 15).attr("r", 6).style("fill", rcolor)
    con = con + 20;



  }

  // then make tooltip


  //tooltip........

  // create a tooltip

  */
  
    legend.selectAll('.legendb').data(keysFrMdl.reverse()).join('rect') //rectangle join instead of loop
    .attr('x', -40)
    .attr('y', (d, i) => i * (( (height  - 300) / keysFrMdl.length) + 20))
    .attr('fill', d => colors(d))
    .attr('width', 15)
    .attr('height', 15)
    
    legend.selectAll('.legendt').data(keysFrMdl).join('text') //text join instead of looping labels to get same order as legendb
    
      .attr('class', 'legendt')
      .attr('x', -20)
      .attr('y', (d, i) => i * ((height - 300) / keysFrMdl.length + 20 ) + 12)
      .attr('dominant-baseline', 'top')
      .text(d => d)


    container.selectAll(".areas")
      .data(stackedData)
      .join('path')
      .attr('d', d => area(d))
      .attr('fill', d => colors(d.key))
      .attr('stroke', d => colors(d.key))

      .on("mousemove", (event, d) => {

          //get MODEL to make specific chart
        var model = d.key

          var ttchartM = {left: 30, right: 10, top: 20, bottom: 50},
              ttchartW = 250,
              ttchartH = 100
              



          tooltip.style("opacity", 1)
          .style("width",  ttchartW + ttchartM.left + ttchartM.right + "px")
          .style("height", ttchartH + ttchartM.top + ttchartM.bottom + "px")
            .style("left", (event.pageX) - (ttchartW / 2) + "px")
            .style("top", (event.pageY) + "px")


          //make tooltip container  

          var tsvg = tooltip.selectAll("svg").data([0]).join('svg')
            .attr("width", ttchartW + ttchartM.left + ttchartM.right)
            .attr("height", ttchartH + ttchartM.top + ttchartM.bottom)
            


          var ttip = tsvg.selectAll(".ttipchart")
          .data([0])
          .join('g')
          .attr('class', 'ttipchart')
            .attr('width', ttchartW)
            .attr('height', ttchartH)
            .attr('transform', `translate(${ttchartM.left}, ${ttchartM.top})`)

            

          var chartX = d3.scaleBand()
            .padding(0.05)
            .domain(dataPre.map(d => d.Date))
              .range([0, ttchartW])
              
          var chartY = d3.scaleLinear()
            .domain([0, d3.max(dataPre, function(d) {
              return d[model]
            })])


            .range([ttchartH, 0])


                  ttip.selectAll('rect').data(dataPre).join('rect')
                    .attr('x', d => chartX(d.Date))
                    .attr('y', function(d) {return chartY(d[model])})
                    .attr('width', chartX.bandwidth())
                    .attr('height', function(d) {
                        return ttchartH - chartY(d[model])
                      })

                    //THIS IS THE TRANSITION SPOT
                    .transition(1000)
                    .attr('fill', colors(model))
                    //console.log(colors(model))
                  
          tsvg.selectAll('.chartx')
          .data([0])
          .join('g')
          .attr('class', "chartx")
            .attr("transform", `translate(${ttchartM.left},${ttchartH + ttchartM.top})`)

            .call(d3.axisBottom(chartX)
              .tickFormat((date) => date.toLocaleString('default', {
                    month:'short'
                  })))

          tsvg.selectAll(".charty")
          .data([0])
          .join('g')
            .attr('class', "charty") //to prevent stacking over and over
            .call(d3.axisLeft(chartY))
            .attr("transform", `translate(${ttchartM.left}, ${ttchartM.top})`)
        })

        .on('mouseout', () => {
          
          //tooltip.style("visibility", "hidden")
          tooltip.style('opacity', 0)
        })
  }

  render() {
      //

      /*
           <div className="container3">



                        <svg id="mysvg" viewBox="00 0 500 1000" width="1000" height="1000"><g></g>

                      
                        <svg id="legend"  viewBox="0 0 200 200" height="300" width="500"><g></g></svg></svg>


        </div>


      */
    return (<div className="child1">


    </div>);
  }
}

export default Child1;