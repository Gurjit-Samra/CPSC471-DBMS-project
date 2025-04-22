# tech_storefront/api/migrations/0008_productviewhistory.py

from django.db import migrations, models
import django.db.models.deletion
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_sitesettings'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductViewHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_email', models.EmailField(max_length=254)),
                ('object_id', models.PositiveIntegerField()),
                ('viewed_at', models.DateTimeField(default=timezone.now)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
        ),
    ]
