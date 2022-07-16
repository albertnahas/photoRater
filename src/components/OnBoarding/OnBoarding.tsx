import React, { FC, useEffect, useState } from "react"
import {
  Button,
  Typography,
  Stack,
  useTheme,
  SvgIconTypeMap,
  Zoom,
} from "@mui/material"
import { Step1Icon } from "../../icons/onBoarding/Step1Icon"
import { Step4Icon } from "../../icons/onBoarding/Step4Icon"
import { Step3Icon } from "../../icons/onBoarding/Step3Icon"
import { Step2Icon } from "../../icons/onBoarding/Step2Icon"
import { OverridableComponent } from "@mui/material/OverridableComponent"

interface OnBoardingStep {
  title: string
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
  body: string
}

const onBoardingSteps: OnBoardingStep[] = [
  {
    title: "Upload your photos",
    icon: Step1Icon,
    body: `Start uploading your best photos to the app, in order to
        get the honest feedback about them, don&apos;t hesitate
        to experiment with many photos`,
  },
  {
    title: "Activate your photo",
    icon: Step2Icon,
    body: `Activate the photos that you need feedback for at the
        moment, using the switch at the bottom left of each
        photo in My Photos tab, people can&apos;t see your
        photos when they are disabled`,
  },
  {
    title: "Rate photos of others",
    icon: Step3Icon,
    body: `Explore rating tab where you can rate other people
        photos, You will get one token for every five rates you
        give, every token allows you to recieve one vote, you
        start with two free tokens`,
  },
  {
    title: "Watch your insights",
    icon: Step4Icon,
    body: `Watch the feedback given by people instantly, click each
        photo to get detailed overview, including people
        comments and impressions`,
  },
]

export var OnBoarding: FC<Props> = function (props) {
  const [step, setStep] = useState(0)
  const [next, setNext] = useState(true)
  const iconStyle: any = { height: 60, width: 60 }
  const theme = useTheme()

  useEffect(() => {
    setNext(false)
    setTimeout(() => {
      setNext(true)
    }, 100)

    if (step === 4 && props.done) {
      props.done()
    }
    return () => {}
  }, [step])

  const StepIcon = onBoardingSteps[step]?.icon || null

  return (
    <Stack spacing={4} sx={{ p: 2, textAlign: "center", alignItems: "center" }}>
      {step < 4 && (
        <>
          <Zoom in={next}>
            <StepIcon sx={iconStyle} />
          </Zoom>
          <Typography variant="h5" color={theme.palette.primary.main}>
            {onBoardingSteps[step].title}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {onBoardingSteps[step].body}
          </Typography>
        </>
      )}
      <Button
        color="primary"
        size="large"
        variant="text"
        onClick={() => setStep((s) => s + 1)}
      >
        {step < 3 ? "Next" : "Done"}
      </Button>
    </Stack>
  )
}

interface Props {
  done: () => void
}
