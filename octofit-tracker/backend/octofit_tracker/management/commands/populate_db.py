from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.conf import settings
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Limpa dados existentes
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()

        # Times
        marvel = Team.objects.create(name='Marvel', description='Marvel Team')
        dc = Team.objects.create(name='DC', description='DC Team')

        # Usuários
        tony = User.objects.create(email='tony@stark.com', name='Tony Stark', team=marvel.name)
        steve = User.objects.create(email='steve@rogers.com', name='Steve Rogers', team=marvel.name)
        bruce = User.objects.create(email='bruce@wayne.com', name='Bruce Wayne', team=dc.name)
        clark = User.objects.create(email='clark@kent.com', name='Clark Kent', team=dc.name)

        # Atividades
        Activity.objects.create(user=tony, type='Run', duration=30, date='2023-01-01')
        Activity.objects.create(user=steve, type='Swim', duration=45, date='2023-01-02')
        Activity.objects.create(user=bruce, type='Cycle', duration=60, date='2023-01-03')
        Activity.objects.create(user=clark, type='Fly', duration=120, date='2023-01-04')

        # Workouts
        Workout.objects.create(name='Super Strength', description='Heavy lifting', suggested_for='DC')
        Workout.objects.create(name='Shield Training', description='Agility and defense', suggested_for='Marvel')

        # Leaderboard
        Leaderboard.objects.create(user=tony, score=100)
        Leaderboard.objects.create(user=steve, score=90)
        Leaderboard.objects.create(user=bruce, score=110)
        Leaderboard.objects.create(user=clark, score=120)

        # Garante índice único em email
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        db['octofit_tracker_user'].create_index('email', unique=True)
        self.stdout.write(self.style.SUCCESS('Banco populado com dados de teste!'))
