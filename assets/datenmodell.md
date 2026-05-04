# Datenmodell - Puffpoint 

## Tabellen

### users
| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid PK | Von Supabase Auth |
| username | string | Anzeigename |
| email | string | Von Supabase Auth |
| erstellt_am | timestamp | Automatisch |

### spots
| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid PK | |
| name | string | Name des Spots |
| kategorie | string | z.B. "Aussicht", "Park" |
| lat | float | GPS Breitengrad |
| lng | float | GPS Längengrad |
| erstellt_von | uuid FK → users | |
| erstellt_am | timestamp | |

### checkins
| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid PK | |
| spot_id | uuid FK → spots | |
| user_id | uuid FK → users | |
| eingecheckt_am | timestamp | |
| zuletzt gesehen | timestamp | |
| aktiv | boolean | |

### spot_fotos
| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid PK | |
| spot_id | uuid FK → spots | |
| foto_url | string | URL aus Supabase Storage |
| hochgeladen_am | timestamp | |