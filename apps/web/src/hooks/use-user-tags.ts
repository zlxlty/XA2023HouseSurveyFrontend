import { useState, useEffect, useCallback } from 'react'
import LC from 'leancloud-storage';

interface Tag {
  id: string
  label: string
}
type tagsTuple = [
  Tag[],
  boolean,
  any,
  (tag: string) => void,
  (mapId: string) => void,
]

export function useUserTags(user_id: string): tagsTuple {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserTags()
  }, [])

  const fetchUserTags = useCallback(async () => {
    try {
      setIsLoading(true)
      const User = await new LC.Query('User').get(user_id)
      const data = await new LC.Query('UserTagMap')
        .equalTo('User', User)
        .include('Tag')
        .find()

      setTags(
        (data as any).map(
          tagMap =>
            ({
              id: tagMap.id,
              label: tagMap.attributes.Tag.attributes.title,
            } as Tag),
        ),
      )
      setIsLoading(false)
    } catch (error) {
      setError(error as any)
      setIsLoading(false)
    }
  }, [])

  async function addTag(tag: string) {
    const User = await new LC.Query('User').get(user_id)
    const Tag = LC.Object.extend('Tag')
    const tagObject = new Tag()
    tagObject.set('title', tag)

    const UserTagMap = LC.Object.extend('UserTagMap')
    const userTagMap = new UserTagMap()
    userTagMap.set('User', User)
    userTagMap.set('Tag', tagObject)
    await userTagMap.save()
    fetchUserTags()
  }

  async function deleteTag(mapId: string) {
    setTags(tags.filter(tag => tag.id !== mapId))
    const userTagMap = await new LC.Query('UserTagMap').get(mapId)
    await userTagMap.destroy()
  }

  return [tags, isLoading, error, addTag, deleteTag]
}
