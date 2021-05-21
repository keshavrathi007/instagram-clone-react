import './App.css';
import Post from "./Post"
import React from 'react';
import { useState, useEffect } from 'react';
import { db, auth } from "./Firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [openSignin, setOpenSignIn] = useState(false)
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser)
        setUser(authUser)
      }
      else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts')
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
      })
  }, [])

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        alert(error.message)
      })
    setOpenSignIn(false)
  }

  return (
    <div className="App">
      <InstagramEmbed
        url='https://instagram.com/p/B_uf9dmAGPw/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => { }}
        onSuccess={() => { }}
        onAfterRender={() => { }}
        onFailure={() => { }}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerLogo" src="data:image/png;base64,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" alt="logo"></img>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}

            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}

            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}

            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignin}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerLogo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAACGCAMAAADgrGFJAAAAkFBMVEX///8mJiYAAAAjIyMgICAcHBwXFxcYGBgaGhoNDQ0QEBAUFBQKCgoGBgbq6ur7+/vBwcHy8vLh4eGamprHx8fT09OwsLDu7u6mpqa2trbMzMypqanX19doaGiRkZHe3t51dXUtLS1gYGCBgYFISEg3NzednZ1AQEBRUVFsbGyKiop9fX1iYmJCQkKTk5M5OTk1zikYAAATtElEQVR4nO1d52LiuBYG2QY3aoDQEloKkML7v91VO0WySZjZeHd8x+fPLh5Z5dPR6XJarYYaaqihhhpqqKGGGmqooYYaaqihhhpqqKGGGmqooYYaaqihhhr6v6LNcDgdVDrCZDKutP9a0uRJ5LkQx0V1Q7yKnkgfZqPqRqgf9Y8ibCsKxXNVXDkWaoAoEQ/9ikaoH71Y2A30FeGyFHaEblTNALWjwV60GSXzaoYZ5naAIKxmgLrRfTvWnA7ApxUBv0gA+F01A9SM+qmCPOjtw4qBX6UA/Gs1A9SLLO5iPRIVAz8H4MNjNQPUikahZnQxbd0D8NlLNUPdZQD8vpoBakWvkcZdWu+VA/8JwEenagaoE2318e9sWxz4u2rGOncA+G01A9SIhoLMuz4C/1nNYIeuHSB+q2aA+pDVp2KofiDwncdqRnuLYYBzNQPUh07GgH/SPyoHfhtVfKRqQ1PL8Ev9qyLgZ58v89liuJxu3sFRyCqyV2tDTxqJ8GJ+VQP8RGRZmia5EBQOCnbHh+1Zbchwsv4LA2YTg3QyMz+rAf5I0TeiIIyirtqQvCdEr9ocwB9IFhNhF07A/6DuG4kS3F0Sm58brha0MZigNzOuAvjlDcD/bcLmbMzqHFJOlQC/yK8jbsXOXxeqzALDcPf2dyXAr0WaZVmnG0eRJ+wDQ6GoyE/+Y8naksEzPKgE+NZi/nL3+Xg+bLd7Qj4TSRYF7d3u+fWpsrjN/fdN/hOyIat4Cw+qAZ5og+K+t6xkAE6rD2m/7v9I7WFtGgq+lwE/3pSVBAw26+v9zvaR6L2W+KZrBF5MS98czY+hELuH2bdzH632quX77JolalL3kfiW68ePT6nIL2+TL5p4nWyKmPR/pT7AZiXyIQ5QBP5Tss3u7KG83Mun4q18rEmUh1J3hPlT4Z+mBHypAfkpUvVqEOWxntPsbj4prwS5E4ltmWjLYChbOug82MVl35zd0YPIdBooFq9qTqP53cwvLXoWIn6fIwabTC7+Y84bjXfSGTl9sXUOQRBYYJclwCuxHHTEBwf5ZDzQWGxLUHkUAYBbECcM+BIRcH+BjKxKhx1arXeRpT3xVCzzGb3mrOW21XrTLS8Uh0Ab9ptU17QXY0+hmLUGaZKlUkLxqSsBGUSpCO3Oxmr1YSroWA5Sc7qi2wIhIHEJhCvAqwc0/8EFshntrhh6fUpWxIUU84cM+KIEuI8do0fiKSwePnajdsRbJg/QMg+ADU/QIiyeO0ZL5BIz5swiEAl2UEBApubZHaQvyRh7sRwT5LtbdAp0SCBcB54xzoWtOhAeO06Zt5Su/BEZ8MWz0vaMTfGCR8eTS5fIbwmv4iEDcNrRg/49WK+2x6eTpzvGLu7y/TlkakRx1sYIGeT4jgAx0MZHYX5Dkdy4APzmBuD3MDX7sisPd2wlRQVKTqwo6MSHbtsjfCBcZbLN/JY4JRgSYx/tzmd/8rKVUjqNwzASH+5sC1EkHLNDrRB4nbxZkTzMbERrwrnthijXqCBqCHh83Qd+7gUAeo6wGbJ/DfLCiAx4/58W9KbSXQ62rkJgIYgwlzqNgwdng+xWKQ57aYTskHBde8BzESRyzJh1xAuulg7wz8Ra9jSRXGPPviTLnqRcvwceWCmF4VPn9PIpZMW9vw78IIEOw97L+H58x4WAqxBo5b3jsN+fHBPW0p6Nq4E5zg20O9nzon+/PnCuYVEMB/g1a2RBcQa7KYtvE3FkTpYAf3SBPxpkxQJkSuII+ZjDVZR2BLx/Gs5Y93Exr/XDoLynWQ8f21IIYlw6G6WhaK8vbJNuzQMmMsibl497DPgDOxcWlBWNf2My2Q5EJQXr68Dv+RtSpQLwOQee732ZAY3A+6WT+GIQgfBnrOUoBNQiPSxBeUKUEfjpNZano4YDRFjjM8fDE1wYTBz4hLGWtZie+CZ3b/L5zSJIcX4L/Kv+lcvOgSFzLuPvGct0S1xKAt6LR2KhkyAnhMQWBx65ktlZTIKhUHoBmZgkKtUC2DBOxv7ZIUDzJGRamAPP9ahtZKQvDHBbCsnqQhz5O+BNe71kRIq7GgPGpQULXyEEYsIvnQQ25u4OsXzOgH9AuJipg2KJYfiiZ9hdzBbDyXINYoUkAR4yXkNEJYbM/B8y4LdK0oTWijLHQr8Tnna2t9tKwfZaYqHBXQL8Ewfe/FBsNQDXUTjRBBKbpaIOeMd3a3Bcwb1uZL+UnuHWOtYDVo0w4HXtFKq6D1BJaAvMkuI7ZIZyDoDa8lg60+ql4Hlk1mHOrQZFjO3Kb6w6HegjghKXgMcIFwfe/LNYcQBc5waMwiuOOgHvlk6CpAli/hTgDNglBsyqOCeNQKSzoY0fOHej4nTfo5IdxM3mE2TAa0kjucM8CdotK17lem2j9Pv4nibjp6cWZwSeyl4+LPDvLVsVYwQbrcR1bl6/3PhrwBcFgSKwFoKAnkFhTtDhLVGVEvCadwM4K6gF6PDAE9csA8HPrcIFAa+GV6fVzEwzrN506c3Y/pIbgW+NLqoTaw1MrwIfvQPYRrbgmfSiXX1w/cR7iXJF4D03AzpzTCREi2viwHIk5RDc2eAjvWvogL9k/oavyznn04pvXtsJtykk8JbhW3aVWcsoHckGwInJ7Tf3zqIbdA76f0uAfw0QKe0sW8gwquNb61iyFIfFiD0B77gZm/JdhMfMEumX8+mgCLw+RNgfMDKtawZq1PUo4DE/ewj8WbGCZgOrzdW7amipEgH4vMyouEL9QySMZCgB/kLAWy2iH6+Lh9vtQQXQCgoer0C5xcJ4Qcf1Z2EtzATCnfMkXAF4vUNkoD8XjF8on/W0EVekQKBBuo+HyApR8PkHZsFyNr8DvFqj+Q8BjyYWAH+yazl5LT3g1eZQ9M4XNwi8K8yhaj50Q1jAx8wEQnPPCzkUgNfqmhRw8UihWtk6HYF4434QAB8ddBcKK6vK5P+rgdS8AfjerdmQ0mEZ8M8IvFnLxmvpnlSl9YNLF6CP2y5jXgG+TKO1GPDElMCn3LFUVABesWSIJ2VcFEVg+ns3AYCheNIZpZLuVJ8iKAQb6/9Th+DHgd8h8HpYwAAh7DodXEIVmh3n6CgKR8nTWwf+GHxuz+srAR7cJ21kMfKBNWYfnvpl8eygsnCtEBChvJrZicUY5WJZRRoaeqB+hcBvN6DRNYFY5qaeMeMV2/ZDip7w2AVGBtwqhgy4z1UKCDzZnrBFsbNxReB1wpKMIZgtqRY0hz2ZPP0OeGNMbI2L0VvqtOCFdfh75RNfAH947FqPQRPIPTfoos6vntnomQItTKocyyMaV7ivBHhQkn55vQe8Fi0sOQbWJC2LDFAXKECASyAOvD0z9kpRMlykdjE/BTzynlWV4dZ9jM4NB15lI3PTZPBB+SMEiYKXDvDXuO++CDxIZs8/Q3OyZ34rP4cHduHqFbmVZMG6Ri8Iw2vAWwTsTqazc2z3bvAzoiZFhMFj0RtARgHwEF+eApB+Hwl5YAL07FlIosVimh7wAA4T6ACBl86lHvTPvivhKfhAA1zxn1AocanHgbf7ZFfSuVMyTRt2/wx4NJOJo1g+gms5sAC5eXGKnZP7gRoW9AAFrrNS4L1JAxtEBDwyRrlKbCf6p5LAjmkKZhMNcA14sFc58HMOvHlkD0a4lbLPSp+8lHlupBLgIwY8cxfPTmRUk9JLPBQwQqsyX2GDMuBR3rr5W+Q+xvE4Pxd4tJY08EbC80w7GEPEFpsrwJ8hGFAOPPAALEWxpTUULCfmv/WxnxLguwx4Fh4oMagVhzsBBEp7mEYsHecAj7B53AJxEybjwSryRA1aSwmMEzn2JgKPuzG+IuOhrLY0SE/7QVUMOGurDH8hVsOoBHiW7ufeNaQeSabP5FwS1x6kHI/SDUNBdUiOOYlpTM+qQaOdxm2XG544kALe2PD3Zf9OHI/izbNqQLJy7c+AB1nFMj5wZqwc5Sxx+wUjAh5fZ/KN91kAXpUJ+Am9saM1wyA+YASNe66oRjw44TkT16A3vMwm9qCAV5uTuP7otiDjB+UKvfQu0idVEqFg4sCbJ5ZN2BqG4pZSD02Togxl1zl47BCBB6zfOgXuIZxUd6euFESgMbguoIyp6xbhtjHLCSSBG1amgy+B/0xdW0sRaCSGMhhYrmG6KItpMBGJkSm0HNAbtpYT27Fd8H2psiUEniQVizby1aCMt8mrtSir5UH7eaUKoeItroGn/t5RALmRQgyRsJIEHNZBlszUxGpWLyL9khZQPpaeHcwhsvApK50gP50y8bBF1sCmF+VM/HlcJUjrMt1Mozpy+ezVGO6CdkkhDVjA+UQJXnliUJxTtGpcPLUuNDwCipvhBEXpokmiRW3qBRRQfTOUYSbuZuNc2OMhq0zGsBt+hgRdHntYiKWkUSZuLZovsS8IFicRjQMbtM9pQa4qAuDjT9mNSrZQchTFlkSNwgssgctKRajxGRNcTKrxah5Vtxt6goY2l8G5KgswI+PxI0UnktlXmEJAqLAEGJrI01OsEL1CCDxpIbZ83gvNW1loip+Ly221HuFcxCpQOWB+C+6stHWyF3RI5yXvcpSxmonboy/MAIi97fNWQSjjVxW4wc+keQ+eMQZgcoTdbbHiBNQ1jh4Gvqq5TsNiDr/s8LXYjiuDd0pydfx0YTbhKy3ExqzgNVjCKA0kGuDSUgTdsLEfmSEXjBtQKXM11EAlefb3gj1ZptGnbEyUEmdWHU0ql+xJPI5gT9rh5dbc/m2YYbFaBgdwA4JkinSGSo7Yqv2xCEPKO/GrxbHxaLZe+ZbcGtkxJZYQGJ1DtsFIPOHs1JPgO7h1410vVK8JRBxCwS7fkmp6Vp7Xq+sIORWpTEdg+AMFgZW+wObSDrjdmaKqFbSDUIm4gRTmuiWqif0MhS44j0PTdERJQGmZmPlhCZxOuY1e43bQG9Dq4GsWugIvyIDDLTY6KAEdAssvGJuqHtplcpWy4XZhUmYFfCaKTiqLd5zkzmbvI9Y5i+2hksvgCV6w0asfiUIFxhc0K2adcVjPZuHJgTaMMbeFPuJpsdmsMhI0QfHyRLIdPqqSxp46msi1HWOSftqAui0RNdiMgqCdosFnOXulM8GX4i0Nl2CAyAjMt0zuEK7M2CXbXL+Oslof+jvRDj6wcxZIAH1NKQqw7YNQISU37OtbQA7BkWdaAY4UG0CTWwdtDz7qvjARgonegETICs94lCswjFtKIrNzmS1X+hZadiK8eof71lIeJ7kDWAkuW04XR/VivF+grLoSHKRKyf24NX5IJCpUHi/2w+VcXytRe2Bd0CCaDEaqZL43RAuGK/8DqyYzBLcywmA+e5K99W4P20CUnbkP5b4iNTUzNxPiJjmnkBt/O08VmuNIF0LCtGfu0CmpgxKtK4QwrgJdOglSkegLeDsKo1+9nD9DaSZ7ijRDU119mPd0+jFR2XYs5+kJ0VXl5mTXOLG5vS5BjpmWP0KZW6pW8Ctf8X0sZGrwkZ9s4/E5uP525R5G5tQabJxGqCO33qcmOs9aVt+5rRUPnb1R4vYIlVPhhg/RW8/pSS3nKXZ7srGVRz5AELFludHo2avcwyNb271zl+3a4SudnJ0JE5RgmRQ09APMOhDIBwvh3cdrKw7zjKoF3zLq9eQsV7yXPBYmZHhwN+Mod2gCwH9x5+6N97RVTwYfXFOFAiKSD2yPlKinUJAPgjfcmn2RPP+V7wxaueIY/vZuYyEANrK3vtIO80D6DyLlwj/oiGMhXjEU9hTFjjP8IsAtDRO2wkfYzAgr01aiY1lLShu16yNwGL4CXkobW84QYhr4DTklFM+0jjONqWb4WrR2r9B4Zy9jBmZrbyWr6FMenr3fiSRN8+KS+hf5D0J4NyD6L0ch8rTT7aq71rvHMiND6iz5ai5Obp99/Vi+9eqkOTYP8rFU1g/U1eicmJbP+mJ7Pyi53FE27jmTr/XEnlzbteo8lb0fHcGweRc9tWjzDQozX9nqhu/qzNu6v/Yv5UPQknKnP12sVouyFa1nq9LU7ng4fzwcPleT63bsdDZflMRM1VDFt0aT2WzpmedrarmhQ/ZtHFa+NnTbDJazVaF3NeaKt5wu5vNF+YcvfNosVrNbo5IwKwP8d99d+MNoylRaTb+xZYKuQX57yuoPoKFzI7aewD/gZ7XrQ8Y+D+oNfP7LZtB/TsbOjz52Fvha/pEpbbKLWn3Y3ThT0TPYY/UE/tyR5metFOubxX0AdQb1/HLokzRUq/9G2w/SVnuY4W6EBW83Z5f/KBq+/Vbd339GJ62Twki5GLUGvmZkwmpBog2ZqM6ipl506HEez+ps1dSK7Nc5IPbauzFk0NA/JJu77UGYEaJMtXK6a0g25YA3iCG8l/yns/oLyGSCgw4wuM2HeTeUG/ppmrkCvvgXCBqqhjquoMEy57/+jxxVTLZEhIUibUHQ7938auhWMpVD/AsgthaiplHhuhD8lTwWHjBfyWn+HnW1ZGx458JV2ujWf4FM9RL/AIi1Jn/vjmlDt5LRpPxupq3g+7q4o6F/SqaKn5eNm7r5RtJUTKYKhckVW1V65Q++NPRjpDmeXUI0t2WYP9VQNaSr5gP8KJeNFzQh4crJiJYYvqRhSlF/pSq6od8kEyTrXBbj8fBkIsSi8JdgGqqAzF+yUBd+cm3QhPUqf6sxDTN+xSrfNUnuf4sGd7HIIvVHSTsiaMTMv0rLu/fncLd/rFURVkMNNdRQQw011FBDDTXUUEMNNdRQQ38A/Q+i+h7rFQK4dQAAAABJRU5ErkJggg==" alt="logo"></img>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}

            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}

            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerLogo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAACGCAMAAADgrGFJAAAAkFBMVEX///8mJiYAAAAjIyMgICAcHBwXFxcYGBgaGhoNDQ0QEBAUFBQKCgoGBgbq6ur7+/vBwcHy8vLh4eGamprHx8fT09OwsLDu7u6mpqa2trbMzMypqanX19doaGiRkZHe3t51dXUtLS1gYGCBgYFISEg3NzednZ1AQEBRUVFsbGyKiop9fX1iYmJCQkKTk5M5OTk1zikYAAATtElEQVR4nO1d52LiuBYG2QY3aoDQEloKkML7v91VO0WySZjZeHd8x+fPLh5Z5dPR6XJarYYaaqihhhpqqKGGGmqooYYaaqihhhpqqKGGGmqooYYaaqihhhr6v6LNcDgdVDrCZDKutP9a0uRJ5LkQx0V1Q7yKnkgfZqPqRqgf9Y8ibCsKxXNVXDkWaoAoEQ/9ikaoH71Y2A30FeGyFHaEblTNALWjwV60GSXzaoYZ5naAIKxmgLrRfTvWnA7ApxUBv0gA+F01A9SM+qmCPOjtw4qBX6UA/Gs1A9SLLO5iPRIVAz8H4MNjNQPUikahZnQxbd0D8NlLNUPdZQD8vpoBakWvkcZdWu+VA/8JwEenagaoE2318e9sWxz4u2rGOncA+G01A9SIhoLMuz4C/1nNYIeuHSB+q2aA+pDVp2KofiDwncdqRnuLYYBzNQPUh07GgH/SPyoHfhtVfKRqQ1PL8Ev9qyLgZ58v89liuJxu3sFRyCqyV2tDTxqJ8GJ+VQP8RGRZmia5EBQOCnbHh+1Zbchwsv4LA2YTg3QyMz+rAf5I0TeiIIyirtqQvCdEr9ocwB9IFhNhF07A/6DuG4kS3F0Sm58brha0MZigNzOuAvjlDcD/bcLmbMzqHFJOlQC/yK8jbsXOXxeqzALDcPf2dyXAr0WaZVmnG0eRJ+wDQ6GoyE/+Y8naksEzPKgE+NZi/nL3+Xg+bLd7Qj4TSRYF7d3u+fWpsrjN/fdN/hOyIat4Cw+qAZ5og+K+t6xkAE6rD2m/7v9I7WFtGgq+lwE/3pSVBAw26+v9zvaR6L2W+KZrBF5MS98czY+hELuH2bdzH632quX77JolalL3kfiW68ePT6nIL2+TL5p4nWyKmPR/pT7AZiXyIQ5QBP5Tss3u7KG83Mun4q18rEmUh1J3hPlT4Z+mBHypAfkpUvVqEOWxntPsbj4prwS5E4ltmWjLYChbOug82MVl35zd0YPIdBooFq9qTqP53cwvLXoWIn6fIwabTC7+Y84bjXfSGTl9sXUOQRBYYJclwCuxHHTEBwf5ZDzQWGxLUHkUAYBbECcM+BIRcH+BjKxKhx1arXeRpT3xVCzzGb3mrOW21XrTLS8Uh0Ab9ptU17QXY0+hmLUGaZKlUkLxqSsBGUSpCO3Oxmr1YSroWA5Sc7qi2wIhIHEJhCvAqwc0/8EFshntrhh6fUpWxIUU84cM+KIEuI8do0fiKSwePnajdsRbJg/QMg+ADU/QIiyeO0ZL5BIz5swiEAl2UEBApubZHaQvyRh7sRwT5LtbdAp0SCBcB54xzoWtOhAeO06Zt5Su/BEZ8MWz0vaMTfGCR8eTS5fIbwmv4iEDcNrRg/49WK+2x6eTpzvGLu7y/TlkakRx1sYIGeT4jgAx0MZHYX5Dkdy4APzmBuD3MDX7sisPd2wlRQVKTqwo6MSHbtsjfCBcZbLN/JY4JRgSYx/tzmd/8rKVUjqNwzASH+5sC1EkHLNDrRB4nbxZkTzMbERrwrnthijXqCBqCHh83Qd+7gUAeo6wGbJ/DfLCiAx4/58W9KbSXQ62rkJgIYgwlzqNgwdng+xWKQ57aYTskHBde8BzESRyzJh1xAuulg7wz8Ra9jSRXGPPviTLnqRcvwceWCmF4VPn9PIpZMW9vw78IIEOw97L+H58x4WAqxBo5b3jsN+fHBPW0p6Nq4E5zg20O9nzon+/PnCuYVEMB/g1a2RBcQa7KYtvE3FkTpYAf3SBPxpkxQJkSuII+ZjDVZR2BLx/Gs5Y93Exr/XDoLynWQ8f21IIYlw6G6WhaK8vbJNuzQMmMsibl497DPgDOxcWlBWNf2My2Q5EJQXr68Dv+RtSpQLwOQee732ZAY3A+6WT+GIQgfBnrOUoBNQiPSxBeUKUEfjpNZano4YDRFjjM8fDE1wYTBz4hLGWtZie+CZ3b/L5zSJIcX4L/Kv+lcvOgSFzLuPvGct0S1xKAt6LR2KhkyAnhMQWBx65ktlZTIKhUHoBmZgkKtUC2DBOxv7ZIUDzJGRamAPP9ahtZKQvDHBbCsnqQhz5O+BNe71kRIq7GgPGpQULXyEEYsIvnQQ25u4OsXzOgH9AuJipg2KJYfiiZ9hdzBbDyXINYoUkAR4yXkNEJYbM/B8y4LdK0oTWijLHQr8Tnna2t9tKwfZaYqHBXQL8Ewfe/FBsNQDXUTjRBBKbpaIOeMd3a3Bcwb1uZL+UnuHWOtYDVo0w4HXtFKq6D1BJaAvMkuI7ZIZyDoDa8lg60+ql4Hlk1mHOrQZFjO3Kb6w6HegjghKXgMcIFwfe/LNYcQBc5waMwiuOOgHvlk6CpAli/hTgDNglBsyqOCeNQKSzoY0fOHej4nTfo5IdxM3mE2TAa0kjucM8CdotK17lem2j9Pv4nibjp6cWZwSeyl4+LPDvLVsVYwQbrcR1bl6/3PhrwBcFgSKwFoKAnkFhTtDhLVGVEvCadwM4K6gF6PDAE9csA8HPrcIFAa+GV6fVzEwzrN506c3Y/pIbgW+NLqoTaw1MrwIfvQPYRrbgmfSiXX1w/cR7iXJF4D03AzpzTCREi2viwHIk5RDc2eAjvWvogL9k/oavyznn04pvXtsJtykk8JbhW3aVWcsoHckGwInJ7Tf3zqIbdA76f0uAfw0QKe0sW8gwquNb61iyFIfFiD0B77gZm/JdhMfMEumX8+mgCLw+RNgfMDKtawZq1PUo4DE/ewj8WbGCZgOrzdW7amipEgH4vMyouEL9QySMZCgB/kLAWy2iH6+Lh9vtQQXQCgoer0C5xcJ4Qcf1Z2EtzATCnfMkXAF4vUNkoD8XjF8on/W0EVekQKBBuo+HyApR8PkHZsFyNr8DvFqj+Q8BjyYWAH+yazl5LT3g1eZQ9M4XNwi8K8yhaj50Q1jAx8wEQnPPCzkUgNfqmhRw8UihWtk6HYF4434QAB8ddBcKK6vK5P+rgdS8AfjerdmQ0mEZ8M8IvFnLxmvpnlSl9YNLF6CP2y5jXgG+TKO1GPDElMCn3LFUVABesWSIJ2VcFEVg+ns3AYCheNIZpZLuVJ8iKAQb6/9Th+DHgd8h8HpYwAAh7DodXEIVmh3n6CgKR8nTWwf+GHxuz+srAR7cJ21kMfKBNWYfnvpl8eygsnCtEBChvJrZicUY5WJZRRoaeqB+hcBvN6DRNYFY5qaeMeMV2/ZDip7w2AVGBtwqhgy4z1UKCDzZnrBFsbNxReB1wpKMIZgtqRY0hz2ZPP0OeGNMbI2L0VvqtOCFdfh75RNfAH947FqPQRPIPTfoos6vntnomQItTKocyyMaV7ivBHhQkn55vQe8Fi0sOQbWJC2LDFAXKECASyAOvD0z9kpRMlykdjE/BTzynlWV4dZ9jM4NB15lI3PTZPBB+SMEiYKXDvDXuO++CDxIZs8/Q3OyZ34rP4cHduHqFbmVZMG6Ri8Iw2vAWwTsTqazc2z3bvAzoiZFhMFj0RtARgHwEF+eApB+Hwl5YAL07FlIosVimh7wAA4T6ACBl86lHvTPvivhKfhAA1zxn1AocanHgbf7ZFfSuVMyTRt2/wx4NJOJo1g+gms5sAC5eXGKnZP7gRoW9AAFrrNS4L1JAxtEBDwyRrlKbCf6p5LAjmkKZhMNcA14sFc58HMOvHlkD0a4lbLPSp+8lHlupBLgIwY8cxfPTmRUk9JLPBQwQqsyX2GDMuBR3rr5W+Q+xvE4Pxd4tJY08EbC80w7GEPEFpsrwJ8hGFAOPPAALEWxpTUULCfmv/WxnxLguwx4Fh4oMagVhzsBBEp7mEYsHecAj7B53AJxEybjwSryRA1aSwmMEzn2JgKPuzG+IuOhrLY0SE/7QVUMOGurDH8hVsOoBHiW7ufeNaQeSabP5FwS1x6kHI/SDUNBdUiOOYlpTM+qQaOdxm2XG544kALe2PD3Zf9OHI/izbNqQLJy7c+AB1nFMj5wZqwc5Sxx+wUjAh5fZ/KN91kAXpUJ+Am9saM1wyA+YASNe66oRjw44TkT16A3vMwm9qCAV5uTuP7otiDjB+UKvfQu0idVEqFg4sCbJ5ZN2BqG4pZSD02Togxl1zl47BCBB6zfOgXuIZxUd6euFESgMbguoIyp6xbhtjHLCSSBG1amgy+B/0xdW0sRaCSGMhhYrmG6KItpMBGJkSm0HNAbtpYT27Fd8H2psiUEniQVizby1aCMt8mrtSir5UH7eaUKoeItroGn/t5RALmRQgyRsJIEHNZBlszUxGpWLyL9khZQPpaeHcwhsvApK50gP50y8bBF1sCmF+VM/HlcJUjrMt1Mozpy+ezVGO6CdkkhDVjA+UQJXnliUJxTtGpcPLUuNDwCipvhBEXpokmiRW3qBRRQfTOUYSbuZuNc2OMhq0zGsBt+hgRdHntYiKWkUSZuLZovsS8IFicRjQMbtM9pQa4qAuDjT9mNSrZQchTFlkSNwgssgctKRajxGRNcTKrxah5Vtxt6goY2l8G5KgswI+PxI0UnktlXmEJAqLAEGJrI01OsEL1CCDxpIbZ83gvNW1loip+Ly221HuFcxCpQOWB+C+6stHWyF3RI5yXvcpSxmonboy/MAIi97fNWQSjjVxW4wc+keQ+eMQZgcoTdbbHiBNQ1jh4Gvqq5TsNiDr/s8LXYjiuDd0pydfx0YTbhKy3ExqzgNVjCKA0kGuDSUgTdsLEfmSEXjBtQKXM11EAlefb3gj1ZptGnbEyUEmdWHU0ql+xJPI5gT9rh5dbc/m2YYbFaBgdwA4JkinSGSo7Yqv2xCEPKO/GrxbHxaLZe+ZbcGtkxJZYQGJ1DtsFIPOHs1JPgO7h1410vVK8JRBxCwS7fkmp6Vp7Xq+sIORWpTEdg+AMFgZW+wObSDrjdmaKqFbSDUIm4gRTmuiWqif0MhS44j0PTdERJQGmZmPlhCZxOuY1e43bQG9Dq4GsWugIvyIDDLTY6KAEdAssvGJuqHtplcpWy4XZhUmYFfCaKTiqLd5zkzmbvI9Y5i+2hksvgCV6w0asfiUIFxhc0K2adcVjPZuHJgTaMMbeFPuJpsdmsMhI0QfHyRLIdPqqSxp46msi1HWOSftqAui0RNdiMgqCdosFnOXulM8GX4i0Nl2CAyAjMt0zuEK7M2CXbXL+Oslof+jvRDj6wcxZIAH1NKQqw7YNQISU37OtbQA7BkWdaAY4UG0CTWwdtDz7qvjARgonegETICs94lCswjFtKIrNzmS1X+hZadiK8eof71lIeJ7kDWAkuW04XR/VivF+grLoSHKRKyf24NX5IJCpUHi/2w+VcXytRe2Bd0CCaDEaqZL43RAuGK/8DqyYzBLcywmA+e5K99W4P20CUnbkP5b4iNTUzNxPiJjmnkBt/O08VmuNIF0LCtGfu0CmpgxKtK4QwrgJdOglSkegLeDsKo1+9nD9DaSZ7ijRDU119mPd0+jFR2XYs5+kJ0VXl5mTXOLG5vS5BjpmWP0KZW6pW8Ctf8X0sZGrwkZ9s4/E5uP525R5G5tQabJxGqCO33qcmOs9aVt+5rRUPnb1R4vYIlVPhhg/RW8/pSS3nKXZ7srGVRz5AELFludHo2avcwyNb271zl+3a4SudnJ0JE5RgmRQ09APMOhDIBwvh3cdrKw7zjKoF3zLq9eQsV7yXPBYmZHhwN+Mod2gCwH9x5+6N97RVTwYfXFOFAiKSD2yPlKinUJAPgjfcmn2RPP+V7wxaueIY/vZuYyEANrK3vtIO80D6DyLlwj/oiGMhXjEU9hTFjjP8IsAtDRO2wkfYzAgr01aiY1lLShu16yNwGL4CXkobW84QYhr4DTklFM+0jjONqWb4WrR2r9B4Zy9jBmZrbyWr6FMenr3fiSRN8+KS+hf5D0J4NyD6L0ch8rTT7aq71rvHMiND6iz5ai5Obp99/Vi+9eqkOTYP8rFU1g/U1eicmJbP+mJ7Pyi53FE27jmTr/XEnlzbteo8lb0fHcGweRc9tWjzDQozX9nqhu/qzNu6v/Yv5UPQknKnP12sVouyFa1nq9LU7ng4fzwcPleT63bsdDZflMRM1VDFt0aT2WzpmedrarmhQ/ZtHFa+NnTbDJazVaF3NeaKt5wu5vNF+YcvfNosVrNbo5IwKwP8d99d+MNoylRaTb+xZYKuQX57yuoPoKFzI7aewD/gZ7XrQ8Y+D+oNfP7LZtB/TsbOjz52Fvha/pEpbbKLWn3Y3ThT0TPYY/UE/tyR5metFOubxX0AdQb1/HLokzRUq/9G2w/SVnuY4W6EBW83Z5f/KBq+/Vbd339GJ62Twki5GLUGvmZkwmpBog2ZqM6ipl506HEez+ps1dSK7Nc5IPbauzFk0NA/JJu77UGYEaJMtXK6a0g25YA3iCG8l/yns/oLyGSCgw4wuM2HeTeUG/ppmrkCvvgXCBqqhjquoMEy57/+jxxVTLZEhIUibUHQ7938auhWMpVD/AsgthaiplHhuhD8lTwWHjBfyWn+HnW1ZGx458JV2ujWf4FM9RL/AIi1Jn/vjmlDt5LRpPxupq3g+7q4o6F/SqaKn5eNm7r5RtJUTKYKhckVW1V65Q++NPRjpDmeXUI0t2WYP9VQNaSr5gP8KJeNFzQh4crJiJYYvqRhSlF/pSq6od8kEyTrXBbj8fBkIsSi8JdgGqqAzF+yUBd+cm3QhPUqf6sxDTN+xSrfNUnuf4sGd7HIIvVHSTsiaMTMv0rLu/fncLd/rFURVkMNNdRQQw011FBDDTXUUEMNNdRQQ38A/Q+i+h7rFQK4dQAAAABJRU5ErkJggg==" alt="logo"></img>
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>

        )}
      </div>
      <div className="app__posts">
        {
          posts.map(({ id, post }) => (
            <Post user={user} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />//flip move is an animation module that gieves transition effects but to implement it we have to put keys else the apl breaks
          ))
        }
      </div>
      {user?.displayName ? (// ? means if user is not there please dont freak out just show null
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>SOrry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
