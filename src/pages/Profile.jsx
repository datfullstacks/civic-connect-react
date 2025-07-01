import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Settings
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
    role: ""
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const response = await usersAPI.getProfile();
          const profileData = response.data.user;
          
          setUserData({
            name: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
            joinDate: profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "",
            role: profileData.role === 'user' ? 'Job Seeker' : profileData.role === 'employer' ? 'Employer' : 'Admin'
          });
        } catch (error) {
          console.error('Failed to load profile:', error);
          // Fallback to user data from AuthContext
          setUserData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
            bio: user.bio || "",
            joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "",
            role: user.role === 'user' ? 'Job Seeker' : user.role === 'employer' ? 'Employer' : 'Admin'
          });
        }
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    setUpdateLoading(true);
    try {
      const updateData = {
        name: userData.name,
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio
      };
      
      await usersAPI.updateProfile(updateData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
    setUpdateLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full w-8 h-8 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
{isEditing ? (
                    <Input 
                      value={userData.name} 
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="text-3xl font-bold text-gray-900 border-2 border-blue-200"
                      placeholder="Enter your name..."
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-fit mx-auto md:mx-0"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                
{isEditing ? (
                  <Input 
                    value={userData.bio} 
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    placeholder="Enter your bio..."
                    className="mb-4"
                  />
                ) : (
                  <p className="text-gray-600 mb-4">{userData.bio || "No bio added yet."}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {userData.joinDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {userData.role}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-500">Connections</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-500">Events</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <Input value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                    ) : (
                      <p className="text-gray-900">{userData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <Input value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
                    ) : (
                      <p className="text-gray-900">{userData.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <Input value={userData.location} onChange={(e) => setUserData({...userData, location: e.target.value})} />
                  ) : (
                    <p className="text-gray-900">{userData.location}</p>
                  )}
                </div>
                {isEditing && (
                  <Button 
                    className="w-full" 
                    onClick={handleSaveProfile}
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Posted about community cleanup event", time: "2 hours ago", icon: Users },
                    { action: "Applied for volunteer position", time: "1 day ago", icon: Briefcase },
                    { action: "Joined local development group", time: "3 days ago", icon: Users },
                    { action: "Shared job opportunity", time: "1 week ago", icon: Briefcase }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <activity.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills & Interests */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Skills & Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Community Development", "Event Planning", "Public Speaking", "Project Management", "Social Media", "Volunteer Coordination"].map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Community Leader", desc: "Led 5+ community events", color: "text-yellow-600" },
                    { title: "Active Volunteer", desc: "100+ volunteer hours", color: "text-green-600" },
                    { title: "Top Contributor", desc: "Most helpful posts this month", color: "text-blue-600" }
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className={`h-5 w-5 ${achievement.color}`} />
                      <div>
                        <p className="font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-sm text-gray-500">{achievement.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Find Connections
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}