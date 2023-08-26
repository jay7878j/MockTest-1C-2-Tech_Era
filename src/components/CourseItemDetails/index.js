import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseItemDetails extends Component {
  state = {
    coursesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCoursesData()
  }

  getCoursesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        id: data.course_details.id,
        name: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        coursesList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {coursesList} = this.state

    const {name, imageUrl, description} = coursesList

    return (
      <div>
        <img src={imageUrl} alt={name} />
        <div>
          <h1>{name}</h1>
          <p>{description}</p>
        </div>
      </div>
    )
  }

  // Render Loading View
  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  // Render Failure View
  renderFailureView = () => {
    const failureViewImg =
      'https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png'

    const onTryAgainBtn = () => {
      this.getCoursesData()
    }

    return (
      <div className="failure-view-container">
        <img
          className="failure-view-img"
          src={failureViewImg}
          alt="failure view"
        />
        <h1 className="heading">Oops! Something Went Wrong</h1>
        <p className="para">
          We cannot seem to find the page you are looking for
        </p>
        <button type="button" className="try-again-btn" onClick={onTryAgainBtn}>
          Retry
        </button>
      </div>
    )
  }

  getRenderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.getRenderViews()}
      </div>
    )
  }
}

export default CourseItemDetails
