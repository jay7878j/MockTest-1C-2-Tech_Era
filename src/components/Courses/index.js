import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Courses extends Component {
  state = {
    coursesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCoursesData()
  }

  getCoursesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()

      const formattedData = data.courses.map(each => ({
        id: each.id,
        name: each.name,
        logoUrl: each.logo_url,
      }))

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

    return (
      <div>
        <h1>Courses</h1>
        <ul>
          {coursesList.map(each => {
            const {id, name, logoUrl} = each

            return (
              <li key={id}>
                <Link to={`/courses/${id}`}>
                  <img src={logoUrl} alt={name} />
                  <p>{name}</p>
                </Link>
              </li>
            )
          })}
        </ul>
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
    return <div>{this.getRenderViews()}</div>
  }
}

export default Courses
