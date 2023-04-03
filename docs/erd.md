```mermaid
erDiagram

        BookingStatus {
            requested requested
accepted accepted
canceled canceled
rejected rejected
paid paid
        }
    
  "Account" {
    String id "🗝️"
    String type 
    String provider 
    String providerAccountId 
    String refresh_token "❓"
    String access_token "❓"
    Int expires_at "❓"
    String token_type "❓"
    String scope "❓"
    String id_token "❓"
    String session_state "❓"
    }
  

  "Session" {
    String id "🗝️"
    String sessionToken 
    DateTime expires 
    }
  

  "User" {
    String userId "🗝️"
    String username 
    String password 
    String email 
    DateTime emailVerified "❓"
    String phoneNumber "❓"
    String address "❓"
    String imageUri "❓"
    DateTime createdAt 
    String salt 
    }
  

  "PetOwner" {
    String petTypes 
    String firstName 
    String lastName 
    String customerId 
    }
  

  "PetSitter" {
    String petTypes 
    Boolean verifyStatus 
    String certificationUri "❓"
    Float startPrice "❓"
    Float endPrice "❓"
    Float avgRating "❓"
    Int reviewCount 
    String recipientId 
    }
  

  "FreelancePetSitter" {
    String firstName 
    String lastName 
    }
  

  "PetHotel" {
    String businessLicenseUri "❓"
    String hotelName 
    }
  

  "Booking" {
    String bookingId "🗝️"
    Float totalPrice 
    DateTime startDate 
    DateTime endDate 
    Int numberOfPets 
    BookingStatus status 
    String note "❓"
    DateTime createdAt 
    }
  

  "Pet" {
    String petId "🗝️"
    String petType 
    String name "❓"
    String sex "❓"
    String breed "❓"
    Float weight "❓"
    DateTime createdAt 
    }
  

  "VerificationToken" {
    String identifier 
    String token 
    DateTime expires 
    }
  

  "Review" {
    String reviewId "🗝️"
    String text "❓"
    Int rating 
    DateTime createdAt 
    }
  

  "Post" {
    String postId "🗝️"
    String title 
    String text "❓"
    String pictureUri 
    String videoUri "❓"
    DateTime createdAt 
    }
  
    "Account" o|--|| "User" : "user"
    "Session" o|--|| "User" : "user"
    "User" o{--}o "PetOwner" : "petOwner"
    "User" o{--}o "PetSitter" : "petSitter"
    "User" o{--}o "Account" : "accounts"
    "User" o{--}o "Session" : "sessions"
    "PetOwner" o|--|| "User" : "user"
    "PetOwner" o{--}o "Pet" : "pet"
    "PetOwner" o{--}o "Booking" : "booking"
    "PetOwner" o{--}o "Review" : "review"
    "PetSitter" o|--|| "User" : "user"
    "PetSitter" o{--}o "FreelancePetSitter" : "freelancePetSitter"
    "PetSitter" o{--}o "PetHotel" : "petHotel"
    "PetSitter" o{--}o "Booking" : "booking"
    "PetSitter" o{--}o "Post" : "post"
    "PetSitter" o{--}o "Review" : "review"
    "FreelancePetSitter" o|--|| "PetSitter" : "petSitter"
    "PetHotel" o|--|| "PetSitter" : "petSitter"
    "Booking" o|--|| "PetOwner" : "petOwner"
    "Booking" o|--|| "PetSitter" : "petSitter"
    "Booking" o{--}o "Pet" : "pet"
    "Booking" o|--|| "BookingStatus" : "enum:status"
    "Pet" o|--|| "PetOwner" : "petOwner"
    "Pet" o{--}o "Booking" : "booking"
    "Review" o|--|| "PetOwner" : "petOwner"
    "Review" o|--|| "PetSitter" : "petSitter"
    "Post" o|--|| "PetSitter" : "petSitter"
```
