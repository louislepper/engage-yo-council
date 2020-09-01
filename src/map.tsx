import * as React from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "./App.css";
import {
  drawmap,
  FeedbackItem,
  rowToFeedbackItem,
  processData,
  getDataFromSheet,
  drawMarkers,
  removeMarkers,
} from "./drawmap";
import { SearchInput } from "./SearchInput";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
interface State {
  viewport: {
    longitude: number;
    latitude: number; // starting position
    zoom: number;
    // height: number;
    // width: number;
  };
  map?: mapboxgl.Map;
  points?: FeedbackItem[];
  markers?: mapboxgl.Marker[];
  filteredPoints?: FeedbackItem[];
}


const params = new URLSearchParams(window.location.search)
const paramLat = params.get('lat');
const paramLon = params.get('lon')

const latitude = paramLat ? parseInt(paramLat) : -33.8688;
const longitude = paramLon ? parseInt(paramLon) : 151.2093;

const initialState: State = {
  viewport: {
    // longitude: 151.2093,
    // latitude: -33.8688, // starting position
    longitude,
    latitude, // starting position
    zoom: 13,
    // height: 400,
    // width: 400
  },
};

type Viewport = typeof initialState.viewport;
export class Map extends React.Component<{}, State> {
  public state: State = initialState;

  public componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.resize();
  }

  async UNSAFE_componentWillUpdate(nextProps: any, nextState: State) {
    if (!nextState.map || !nextState.filteredPoints) {
      return;
    }
    // If we haven't drawn any markers before, draw them AND the map
    if (!this.state.markers && !nextState.markers) {
      const { map, filteredPoints } = nextState;
      drawmap(map);
      const markers = drawMarkers(map, filteredPoints);
      this.setState({
        markers,
      });
    }
    // If we HAVE drawn markers before, and the points are different, remove then draw them
    if (
      this.state.markers &&
      this.state.filteredPoints !== nextState.filteredPoints
    ) {
      console.log("Redrawing markers");
      const { map, filteredPoints } = nextState;
      removeMarkers(this.state.markers);
      const markers = drawMarkers(map, filteredPoints);
      this.setState({
        markers,
      });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  public async componentWillMount() {
    const data = await getDataFromSheet();
    const spData = data.feed.entry;
    const rows = processData(spData);

    const feedbackItems: FeedbackItem[] = rows.map(rowToFeedbackItem);
    this.setState({
      points: feedbackItems,
      // Initially, show all points
      filteredPoints: feedbackItems,
    });
  }
  public updateViewport = (viewport: Viewport) => {
    this.setState((prevState) => ({
      viewport: { ...prevState.viewport, ...viewport },
    }));
  };

  public resize = () => {
    this.setState((prevState) => ({
      viewport: {
        ...prevState.viewport,
        height: window.innerHeight,
        // width: window.innerWidth,
      },
    }));
  };

  private inputChange = (text: string) => {
    // private inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const text: string = e.target.value;

    if (!this.state.points) {
      return;
    }

    const newFilteredPoints = this.state.points.filter((point) =>
      point.Title?.toLowerCase().includes(text.toLowerCase())
    );

    this.setState({
      // Initially, show all points
      filteredPoints: newFilteredPoints,
    });
  };
  private buttonClick = (e: any) => {
    if (this.state.markers) {
      removeMarkers(this.state.markers);
    }
  };

  public render() {
    const { viewport } = this.state;
    return (
      <div id="container">
        <div id="search_overlay">
          <SearchInput onSearchTermUpdated={this.inputChange} />
        </div>
        <div id="map">
          <ReactMapGL
            width={"100%"}
            height={"100%"}
            className={"mapClass"}
            {...viewport}
            mapStyle={"mapbox://styles/mapbox/streets-v11"}
            ref={(ref) =>
              ref && !this.state.map && this.setState({ map: ref.getMap() })
            }
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onViewportChange={(v: Viewport) => this.updateViewport(v)}
          >
            <div style={{ position: "absolute", right: 30, bottom: 30 }}>
              <NavigationControl onViewportChange={this.updateViewport} />
            </div>
          </ReactMapGL>
        </div>
      </div>
    );
  }
}
