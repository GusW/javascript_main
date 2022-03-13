import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const _createArray = (len) => [...Array(len)]

const Star = ({ selected = false, onClick }) => (
  <FaStar color={selected ? 'yellow' : 'gray'} onClick={onClick} />
)

const StarRating = ({ totalStars = 5 }) => {
  const [selectedStars, setSelectedStars] = useState(0)
  return (
    <>
      {_createArray(totalStars)?.map((_, idx) => (
        <Star
          key={idx}
          selected={idx < selectedStars}
          onClick={() => setSelectedStars(idx + 1)}
        />
      ))}
      <p>
        Score: {selectedStars}/{totalStars}
      </p>
    </>
  )
}

export default StarRating
