import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Heart,
  MessageCircle,
  Share2,
  ImageIcon,
  MapPin,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react"

// Avatar components (inline)
const Avatar = ({ children, className = "" }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
)

const AvatarImage = ({ src, alt, className = "" }) => (
  <img className={`aspect-square h-full w-full ${className}`} src={src} alt={alt} />
)

const AvatarFallback = ({ children, className = "" }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`}>
    {children}
  </div>
)

// Badge component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
)

// Sample data for posts
const posts = [
  {
    id: 1,
    author: {
      name: "Mumbai Municipal Corporation",
      handle: "MumbaiMC",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      isOfficial: true,
    },
    content:
      "Road repair work will be carried out on Western Express Highway from Andheri to Borivali on June 15-16. Please plan your travel accordingly.",
    timestamp: "1 hour ago",
    likes: 245,
    comments: 32,
    shares: 78,
    isLiked: false,
  },
  {
    id: 2,
    author: {
      name: "Ravi Kumar",
      handle: "ravikumar",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
      isOfficial: false,
    },
    content:
      "The new digital literacy program at our community center is amazing! Already learned how to access government services online. Thanks @DigitalIndiaOfficial for the initiative!",
    timestamp: "3 hours ago",
    likes: 89,
    comments: 14,
    shares: 5,
    isLiked: true,
  },
  {
    id: 3,
    author: {
      name: "Delhi Government",
      handle: "DelhiGov",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      isOfficial: true,
    },
    content:
      "🚀 New online portal for birth certificate applications is now live! Apply from the comfort of your home. Visit delhi.gov.in/certificates",
    timestamp: "5 hours ago",
    likes: 432,
    comments: 67,
    shares: 156,
    isLiked: false,
  },
]

export default function SocialFeed() {
  const [postText, setPostText] = useState("")
  const [postLikes, setPostLikes] = useState(
    posts.reduce((acc, post) => {
      acc[post.id] = { liked: post.isLiked, count: post.likes }
      return acc
    }, {})
  )

  const handleLike = (postId) => {
    setPostLikes(prev => ({
      ...prev,
      [postId]: {
        liked: !prev[postId].liked,
        count: prev[postId].liked ? prev[postId].count - 1 : prev[postId].count + 1
      }
    }))
  }

  const handlePost = () => {
    if (postText.trim()) {
      console.log("New post:", postText)
      setPostText("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="You" />
              <AvatarFallback className="bg-blue-500 text-white">You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                placeholder="What's happening in your community?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                <ImageIcon className="h-4 w-4 mr-1" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </Button>
            </div>
            <Button 
              onClick={handlePost}
              disabled={!postText.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {post.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm">{post.author.name}</h3>
                      {post.author.isVerified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                      {post.author.isOfficial && (
                        <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">
                          Official
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{post.author.handle} • {post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <p className="text-sm leading-relaxed">{post.content}</p>
            </CardContent>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`h-8 px-3 ${
                      postLikes[post.id]?.liked 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 mr-1 ${
                        postLikes[post.id]?.liked ? 'fill-current' : ''
                      }`} 
                    />
                    <span className="text-xs">{postLikes[post.id]?.count || post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-500 hover:text-green-500">
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.shares}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
