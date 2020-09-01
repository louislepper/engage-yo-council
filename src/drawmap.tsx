import React from 'react';
import mapboxgl from 'mapbox-gl';
import { renderToString } from 'react-dom/server'
import Card from './Card';

export function getDataFromSheet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = process.env.REACT_APP_DATA_SOURCE || "";
    fetch(url)
      .then(res => res.json())
      .then(result => {
        resolve(result);
      });
  });
}

export type SurveyStatus = 'Open' | 'Closed' | 'Under review';

export interface FeedbackItem {
  id: number;
  Latitude: number;
  Longitude: number;
  Councilname?: string;
  Title?: string,
  Link?: string,
  Emailcontactname?: string;
  Email?: string;
  Phonenumber?: string;
  Surveylink?: string
  Fulldescription?: string
  OpenUnderreviewclosed?: SurveyStatus
  Category?: string;
}

export function rowToFeedbackItem(row: string[]): FeedbackItem {
  return {
    id: parseInt(row[0]),
    Councilname: row[1],
    Longitude: parseFloat(row[2]),
    Latitude: parseFloat(row[3]),
    Title: row[4],
    Link: row[5],
    Emailcontactname: row[6],
    Email: row[7],
    Phonenumber: row[8],
    Surveylink: row[9] === 'null' ? '' : row[9],
    Fulldescription: row[10],
    OpenUnderreviewclosed: row[11] as SurveyStatus, // YOLO
    Category: row[12] || '',
  }
}

export function drawMarker(item: FeedbackItem, map: mapboxgl.Map): mapboxgl.Marker {
  const { Latitude, Longitude, Category } = item;
  var popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(renderToString(
      <Card item={item} />
    ));

  let markerOptions: { color?: string } = {};
  switch (Category) {
    case 'park':
      markerOptions.color = 'green';
      break;
    case 'traffic':
      markerOptions.color = 'grey';
      break;
    case 'cycle':
      markerOptions.color = 'red';
      break;
    case 'retail':
      markerOptions.color = 'orange';
      break;
    case 'housing':
      markerOptions.color = 'blue'
  }

  return new mapboxgl.Marker(markerOptions)
    .setLngLat([Latitude, Longitude])
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);
}
// Data is the spdata thing, returns list of things
export function processData(data: any): string[][] {
  // var table = drawTable(parent);
  let allRows = [];
  var rowData = [];

  for (var r = 0; r < data.length; r++) {
    var cell = data[r]["gs$cell"];
    var val = cell["$t"];
    if (cell.col === "1") {
      if (rowData[0] && rowData[0] !== "id") {
        if (rowData.length !== 13) {
          console.log("Incomplete data detected for: " + JSON.stringify(rowData));
        }
        allRows.push(rowData);
      }
      rowData = [];
    }
    rowData.push(val);
  }
  if (rowData[0] && rowData[0] !== "id") {
    if (rowData.length !== 13) {
      console.log("Incomplete data detected for: " + JSON.stringify(rowData));
    }
    allRows.push(rowData);
  }
  return allRows;
}

export function drawmap(map: mapboxgl.Map): void {
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());
  // Add geolocate control to the map.
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }));
}
export function removeMarkers(markers: mapboxgl.Marker[]): void {
  markers.map(marker => marker.remove());
}

export function drawMarkers(map: mapboxgl.Map, points: FeedbackItem[]): mapboxgl.Marker[] {

  const markers = points
    .filter(point => point.Latitude && point.Longitude)
    .map((feedbackItem: FeedbackItem) => {
      return drawMarker(feedbackItem, map);
    });

  return markers;
}