import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from events.models import DancePartner

def seed_dancers():
    dancers = [
        {
            "name": "Aria Chen",
            "avatar_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300&h=300",
            "style": "Salsa & Bachata",
            "bio": "Award-winning Latin dancer specializing in Salsa and Bachata. Guaranteed to bring high energy, elegance, and incredible rhythm to the dance floor! Aria loves teaching guests standard steps and signature moves.",
            "price": 1500.00,
            "rating": 4.9
        },
        {
            "name": "Marcus Brooks",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
            "style": "Hip Hop & Breakdance",
            "bio": "Urban choreographer and professional breakdancer. Marcus has performed in national dance campaigns and international tours. He is ready to ignite the dance floor and host hype battles!",
            "price": 2000.00,
            "rating": 4.8
        },
        {
            "name": "Priya Sharma",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
            "style": "Bollywood Fusion",
            "bio": "Energetic and highly expressive Bollywood & Kathak fusion dancer. Priya specializes in crowd interaction, teaching guests signature hook steps, and performing highly vibrant choreographies.",
            "price": 1200.00,
            "rating": 5.0
        },
        {
            "name": "Elena Rostova",
            "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
            "style": "Contemporary Soloist",
            "bio": "Graceful and deeply emotional contemporary solo dancer. Elena creates breathtaking atmospheric visual choreographies, perfect for opening sets or VIP stages.",
            "price": 1800.00,
            "rating": 4.7
        }
    ]

    for d in dancers:
        DancePartner.objects.get_or_create(
            name=d["name"],
            defaults={
                "avatar_url": d["avatar_url"],
                "style": d["style"],
                "bio": d["bio"],
                "price": d["price"],
                "rating": d["rating"]
            }
        )
    print("Successfully populated 4 premium dance partners!")

if __name__ == '__main__':
    seed_dancers()
