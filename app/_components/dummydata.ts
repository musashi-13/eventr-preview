const EventData = {
    "EventId": 1,
    "EventName": "Sample Music Festival",
    "HostId": 101,
    "Description": "A sample music festival event for testing purposes. This is a dummy event. Join us for an unforgettable experience filled with live music, food stalls, and fun activities. Enjoy performances from top artists and discover new talents. Perfect for music lovers of all ages. Don't miss out on this exciting event!",
    "ThumbnailURL": "https://example.com/thumbnail.jpg",
    "CoverPictureURL": "https://example.com/cover.jpg",
    "BannerURL": "https://example.com/banner.jpg",
    "Visibility": "live",
    "EventTags": ["music", "festival", "live"],
    "Schedule": "onTime",
    "Venue": "Open Grounds",
    "StartingTime": "2024-09-20T18:00:00",
    "EndingTime": "2024-09-20T23:00:00",
    "Duration": "5 hours",
    "AgeLimit": 18,
    "TotalTickets": 1000,
    "CreatedAt": "2024-08-10T10:00:00",
    "UpdatedAt": "2024-08-15T14:00:00",
    "DeletedAt": null,
    "LastCustomNotif": "2024-09-05T12:30:00",
    "Artists": [
    {
        "ArtistId": 201,
        "Role": "Lead Singer"
    },
    {
        "ArtistId": 202,
        "Role": "Guitarist"
    },
    {
        "ArtistId": 203,
        "Role": "Drummer"
    }
    ]
}
  
const ArtistData = {
    "Artists": [
        {
        "ArtistId": 201,
        "Name": "John Doe",
        "Image": "https://example.com/johndoe.jpg"
        },
        {
        "ArtistId": 202,
        "Name": "Jane Smith",
        "Image": "https://example.com/janesmith.jpg"
        },
        {
        "ArtistId": 203,
        "Name": "Michael Lee",
        "Image": "https://example.com/michaellee.jpg"
        }
    ]
}

export { EventData, ArtistData };