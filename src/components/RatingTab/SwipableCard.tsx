import { styled } from '@mui/system'
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform
} from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'

// basic default styles for container
const Frame = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'hidden'
})<{ visible?: boolean }>(({ theme, hidden }) => ({
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  ...(hidden && {
    transition: '500ms opacity',
    opacity: '0'
  })
}))

export const SwipableCard: FC<Props> = ({ children, onSwipe }) => {
  const stops = [-250, -200, -150, -100, -50, 0, 50, 100, 150, 200, 250]
  const [done, setDone] = useState(false)

  // To move the card as the user drags the cursor
  const motionValue = useMotionValue(0)

  // To rotate the card as the card moves on drag
  const rotateValue = useTransform(motionValue, [-250, 250], [-50, 50])

  // To decrease opacity of the card when swiped
  // on dragging card to left(-200) or right(200)
  // opacity gradually changes to 0
  // and when the card is in center opacity = 1
  const opacityValue = useTransform(
    motionValue,
    [-250, -150, 0, 150, 250],
    [0, 1, 1, 1, 0]
  )

  useEffect(() => {
    console.log(`motionValue`)
  }, [motionValue])

  // Framer animation hook
  const animControls = useAnimation()

  return (
    <Frame
      // center
      // Card can be drag only on x-axis
      drag
      animate={animControls}
      dragMomentum={false}
      _dragY={motionValue}
      style={{ x: motionValue, rotate: rotateValue, opacity: opacityValue }}
      dragConstraints={{ left: -0, right: 0 }}
      dragElastic={0.5}
      onDrag={(e, { offset }) => {
        // Move the card as the user drags the cursor

        motionValue.set(offset.x)
        const snapTo = stops.reduce((acc, curr) => {
          if (Math.abs(curr - offset.x) < Math.abs(acc - offset.x)) return curr
          return acc
        }, 1000)
        const rate = (snapTo + 250) / 50

        onSwipe((snapTo + 250) / 100)
      }}
      onDragEnd={(event, info) => {
        const snapTo = stops.reduce((acc, curr) => {
          if (Math.abs(curr - info.offset.x) < Math.abs(acc - info.offset.x))
            return curr
          return acc
        }, 1000)
        onSwipe((snapTo + 250) / 100, true)
        animControls.start({ x: 0, transition: { duration: 0.2 } })
        setDone(true)
        // If the card is dragged only upto 150 on x-axis
        // bring it back to initial position
        //   if (Math.abs(info.point.x) <= 150) {
        //     animControls.start({ x: 0 })
        //   } else {
        //     // If card is dragged beyond 150
        //     // make it disappear
        //     // making use of ternary operator
        //     animControls.start({ x: info.point.x < 0 ? -200 : 200 })
        //   }
      }}
      hidden={done}
    >
      {children}
    </Frame>
  )
}

interface Props {
  children: JSX.Element
  onSwipe: (value: number, submit?: true) => void
}
