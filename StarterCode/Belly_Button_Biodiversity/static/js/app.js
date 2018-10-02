function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  metadata = "/metadata/" + sample;
  d3.json(metadata).then(function(data) {
    var panel = d3.select("#sample-metadata");
    panel.html("");
    
    Object.entries(data).forEach(([key, value]) => {
    var cell = panel.append("p");
      cell.text(`${key} : ${value}`);
      // passthis = key + ": " + value;
      // cell.text(passthis);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  sampleData = "/samples/" + sample;
  d3.json(sampleData).then(function(response) {
    console.log(response);
    data = []
    for (var i = 0; i < response.otu_ids.length; i++) {
      data.push({"otu_ids": response.otu_ids[i], "otu_labels": response.otu_labels[i], "sample_values": response.sample_values[i]});

  };

  data.sort((a, b) => b.sample_values - a.sample_values);
  data = data.slice(0, 10);
  console.log(data);

    // @TODO: Build a Pie Chart
    var trace1 = {
      values: data.map(data => data.sample_values),
      labels: data.map(data => data.otu_ids),
      hovertext: data.map(data => data.otu_labels),
      type: "pie"
    };
    var pieChart = [trace1];
    Plotly.newPlot("pie", pieChart);
    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      type: "scatter",
      mode: "markers",
      title: "otu_ids",
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      },
      text: response.otu_labels
    };
    var bubbleChart = [trace2];
    Plotly.newPlot("bubble", bubbleChart);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
   
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
