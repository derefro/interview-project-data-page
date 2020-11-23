import './App.css';
import React, {
  useState,
  useEffect
} from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons'

const graphShapes = ['circle','rect','triangle'];
const graphColors = ['#000482','#1642c7','#36bfff'];

function GetDataSet ()
{
  const [dataset, setDataset] = useState(null);
  useEffect(() => {
    fetch(`https://run.mocky.io/v3/a2cc3707-8691-4188-8413-6183a7bb3d32`)
    .then(res => res.json())
    .then(setDataset)
    .catch(console.error);
  }, []);
  return dataset;
}

function SummaryData ({summary})
{
  return (
    <div className="summary-data">
      <div className="summary-data-block">
        <h4 className="big-num">{(summary.jobs.regional).toLocaleString()}</h4>
        <p className="title">Jobs ({summary.jobs.year})</p>
        <p className="desc">{(Math.round((summary.jobs.regional / summary.jobs.national_avg) * 100))}% {(summary.jobs.regional >= summary.jobs.national_avg) ? <span className="green">above</span> : <span className="below">below</span>} national average</p>
      </div>
      <div className="summary-data-block">
        <h4 className={"big-num "+((summary.jobs_growth.regional > 0)?`green`:`red`)}>{(summary.jobs_growth.regional > 0)?`+`:`-`}{summary.jobs_growth.regional}%</h4>
        <p className="title">% change ({summary.jobs_growth.start_year} - {summary.jobs_growth.end_year})</p>
        <p className="desc">Nation: <span className={(summary.jobs_growth.national_avg > 0)?`green`:`red`}>{(summary.jobs_growth.national_avg > 0)?`+`:`-`}{summary.jobs_growth.national_avg}%</span></p>
      </div>
      <div className="summary-data-block">
        <h4 className="big-num">${(summary.earnings.regional).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}/hr</h4>
        <p className="title">Median Hourly Earnings</p>
        <p className="desc">Nation: ${(summary.earnings.national_avg).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}/hr</p>
      </div>
    </div>
    );
}

function RegionInfo ({regionInfo})
{
  let yearDiff = (regionInfo.data[(regionInfo.data.length-1)] - regionInfo.data[0]);
  let percDiff = ((yearDiff / regionInfo.data[0]) * 100);
  return (
    <div className="region-info">
      <div className="region-name"><div className={"graphshape "+regionInfo.legendShape} style={{backgroundColor:regionInfo.legendColor,borderColor:regionInfo.legendColor}} />{regionInfo.name}</div>
      <div className="region-num">{regionInfo.data[0].toLocaleString()}</div>
      <div className="region-num">{regionInfo.data[(regionInfo.data.length-1)].toLocaleString()}</div>
      <div className="region-num">{yearDiff.toLocaleString()}</div>
      <div className="region-num">{percDiff.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}%</div>
    </div>
    );
}

function RegionalTrends ({trends})
{

  let yearBegin = trends.start_year;
  let yearLabels = [];
  for (let i = 0; i < trends.regional.length; i++) {
    yearLabels[i] = yearBegin + i;
  }
  let regionalDataset = [];
  for (let i = 0; i < trends.regional.length; i++) {
    let perc = (((trends.regional[i] - (trends.regional[0])) / trends.regional[i]) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2});
    regionalDataset[i] = perc;
  }
  let stateDataset = [];
  for (let i = 0; i < trends.state.length; i++) {
    let perc = (((trends.state[i] - (trends.state[0])) / trends.state[i]) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2});
    stateDataset[i] = perc;
  }
  let nationDataset = [];
  for (let i = 0; i < trends.nation.length; i++) {
    let perc = (((trends.nation[i] - (trends.nation[0])) / trends.nation[i]) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2});
    nationDataset[i] = perc;
  }
  let chartData = {
        labels: yearLabels,
        datasets: [{
            label: 'Regional',
            fill: false,
            backgroundColor: graphColors[0],
            borderColor: graphColors[0],
            pointBorderColor: graphColors[0],
            pointBackgroundColor: graphColors[0],
            pointStyle: graphShapes[0],
            pointRadius: 5,
            pointHoverRadius: 8,
            data: regionalDataset
        },
        {
            label: 'State',
            fill: false,
            backgroundColor: graphColors[1],
            borderColor: graphColors[1],
            pointBorderColor: graphColors[1],
            pointBackgroundColor: graphColors[1],
            pointStyle: graphShapes[1],
            pointRadius: 5,
            pointHoverRadius: 8,
            data: stateDataset
        },
        {
            label: 'Nation',
            fill: false,
            backgroundColor: graphColors[2],
            borderColor: graphColors[2],
            pointBorderColor: graphColors[2],
            pointBackgroundColor: graphColors[2],
            pointStyle: graphShapes[2],
            pointRadius: 5,
            pointHoverRadius: 8,
            data: nationDataset
        }
        ]
    };

    // Configuration options go here
  let chartOptions = {
    legend: { display: false },
    tooltips: { intersect: false, mode: 'index' },
    scales: {
            yAxes: [{
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: "Percent Change"
              }
            }]
        }
  }
  return (
    <div className="regional-data">
      <Line data={chartData} options={chartOptions} height={50} />
      <div className="region-info-cont">
        <div className="region-info-labels">
          <div className="region-name">Region</div>
          <div className="region-num">{trends.start_year} Jobs</div>
          <div className="region-num">{trends.end_year} Jobs</div>
          <div className="region-num">Change</div>
          <div className="region-num">% Change</div>
        </div>
        <RegionInfo regionInfo={{name:"Region",legendShape:graphShapes[0],legendColor:graphColors[0],data:trends.regional}} />
        <RegionInfo regionInfo={{name:"State",legendShape:graphShapes[1],legendColor:graphColors[1],data:trends.state}} />
        <RegionInfo regionInfo={{name:"Nation",legendShape:graphShapes[2],legendColor:graphColors[2],data:trends.nation}} />
      </div>
    </div>
    );
}

function IndustryInfo ({industryInfo, jobsTotal})
{
  return (
    <div className="industry-info">
      <div className="jobs-perc-bar" style={{width:((industryInfo.in_occupation_jobs / jobsTotal) * 100)+"%"}}></div>
      <div className="industry-name"><FontAwesomeIcon icon={faBuilding} />&nbsp;{industryInfo.title}</div>
      <div className="industry-num">{industryInfo.in_occupation_jobs.toLocaleString()}</div>
      <div className="industry-num">{((industryInfo.in_occupation_jobs / jobsTotal) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}%</div>
      <div className="industry-num">{((industryInfo.in_occupation_jobs / industryInfo.jobs) * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}%</div>
    </div>
    );
}

function IndustryData ({industryData})
{
  return (
    <div className="industry-data">
      <div className="industry-info-cont">
        <div className="industry-info-labels">
          <div className="industry-name">Industry</div>
          <div className="industry-num">Occupation Jobs In Industry {industryData.year}</div>
          <div className="industry-num">% of Occupation In Industry {industryData.year}</div>
          <div className="industry-num">% of Total Jobs In Industry {industryData.year}</div>
        </div>
        {industryData.industries.map( (industryInfo,i) => (
            <IndustryInfo industryInfo={industryInfo} jobsTotal={industryData.jobs} key={i} />
        ))}
      </div>
    </div>
    );
}

function OccupationData ({occupationDataSet})
{
  if(occupationDataSet)
  {
    return (
      <>
      <section>
      <h3>Occupation Summary for {occupationDataSet.occupation.title}</h3>
      <SummaryData summary={occupationDataSet.summary} />
      </section>
      <section>
      <h3>Regional Trends</h3>
      <RegionalTrends trends={occupationDataSet.trend_comparison} />
      </section>
      <section>
      <h3>Industries Employing {occupationDataSet.occupation.title}</h3>
      <IndustryData industryData={occupationDataSet.employing_industries} />
      </section>
      </>
    );
  }
  else
  {
    return (
      <div>
        <p>No Data Available Yet</p>
      </div>
    );
  }
}

function App()
{
  const occupationSet = GetDataSet();
  return (
    <div className="main">
      <header>
        <h1>Occupation Overview</h1>
        <h2>{(occupationSet ? occupationSet.occupation.title+` in `+occupationSet.region.title : `Getting Data...`)}</h2>
      </header>
      {(occupationSet ? <OccupationData occupationDataSet={occupationSet} /> : ``)}
    </div>
  );
}

export default App;
