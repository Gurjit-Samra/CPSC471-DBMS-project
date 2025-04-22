# tech_storefront/api/models/site_settings.py

from django.db import models

class SiteSettings(models.Model):
    """
    Holds site-wide configuration like the OpenAI key and support email.
    We'll assume there's only one row of this model.
    """
    openai_api_key = models.CharField(max_length=255, blank=True, null=True)
    support_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return "Site Settings"
