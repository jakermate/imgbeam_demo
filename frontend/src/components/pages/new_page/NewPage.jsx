import React, {useEffect, useState, useRef} from 'react'
import SuperGrid from '../../SuperGrid'
import MoonLoader from 'react-spinners/MoonLoader'
export default function NewPage(props) {
    useEffect(()=>{
        getGalleries()
    },[])
    // mounting completion
  const [mounted, setMounted] = useState(false)

  // get most-trending slice
  const [noMore, setNoMore] = useState(false)
  let noMoreRef = useRef(noMore)
  noMoreRef.current = noMore
  const [galleries, setGalleries] = useState([])
  let trendingRef = useRef(galleries)
  trendingRef.current = galleries

  useEffect(() => {
    if (galleries.length === 0) {
      getMore()
    }
  }, [galleries])
  async function getGalleries() {
    if (noMore) {
      return
    }
    console.log("getting galleries from new")
    let from = trendingRef.current.length
    let to = from + 60
    let url = `/api/trending/new?from=${from}&to=${to}`
    console.log("fetching " + from + " " + to)
    try {
      let res = await fetch(url)
      let json = await res.json()
      if (res.status === 200) {
        if (json.length === 0) {
          setNoMore(true)
          setGettingMoreGalleries(false)
          return
        }
        // console.log('NEW GALLERIES ' + from + ' ' + to)
        // make sure galleries not already in trending
        let newGalleries = json.filter((newGallery) => {
          let isNew = true
          galleries.forEach((oldGallery) => {
            if (oldGallery.gallery_id === newGallery.gallery_id) {
              isNew = false
            }
          })
          return isNew
        })
        console.log(newGalleries)
        setGalleries([...galleries, ...newGalleries])
        setGettingMoreGalleries(false)
        if(!mounted){
          setMounted(true)
        }
      }
    } catch (err) {
      console.log(err)
      setGettingMoreGalleries(false)
    }
  }
  // trigger get more function
  const [gettingMoreGalleries, setGettingMoreGalleries] = useState(false)
  function getMore() {
    // exit out if allready in process of fetching and updating page
    if (gettingMoreGalleries == true || noMore) {
      return
    }
    setGettingMoreGalleries(true)
  }
  useEffect(() => {
    if (gettingMoreGalleries) {
      getGalleries()
    }
  }, [gettingMoreGalleries])


    return (
        <div
        className="new-container ml-4 z-10 mx-auto relative"
        style={{}}
      >

        <div className="flex flex-row justify-start mt-2">
          {mounted ? (
            <SuperGrid 
              galleries={galleries}
              getMore={getGalleries}>
            </SuperGrid>
         
          ) : (
            <MoonLoader color={"white"} size={30}></MoonLoader>
          )}
        </div>
        <div
          id="getting-more"
          className="w-full py-16 flex flex-col justify-center items-center"
        >
          {galleries.length > 0 && gettingMoreGalleries && (
            <MoonLoader color={"white"} size={30}></MoonLoader>
          )}
        </div>
      </div>
    )
}
