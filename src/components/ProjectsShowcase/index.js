import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    data: [],
    activeId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({data: updatedData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelect = event => {
    this.setState({activeId: event.target.value}, this.getData)
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="project-list">
        {data.map(eachProject => (
          <li className="project-item" key={eachProject.id}>
            <img
              src={eachProject.imageUrl}
              alt={eachProject.name}
              className="image"
            />
            <p className="heading">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="0b69ff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getData()
  }

  renderFinalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="nav-image"
            alt="website logo"
          />
        </nav>
        <div className="list-container">
          <select
            className="select"
            value={activeId}
            onChange={this.onChangeSelect}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderFinalView()}
        </div>
      </div>
    )
  }
}
export default ProjectsShowcase
