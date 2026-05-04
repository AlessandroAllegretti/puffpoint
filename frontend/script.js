// Karte initialisieren
        const map = L.map('map').setView([47.608874, 9.408999], 13);

        // OpenStreetMap Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        // Array für alle Marker
        let markers = [];
        let currentPosition = null;
        let isPickingLocation = false;
        let tempMarker = null; // Temporärer Preview-Marker

        // Position auswählen aktivieren
        function startPickingLocation() {
            isPickingLocation = true;
            
            // UI anpassen
            document.getElementById('addMarkerBtn').classList.add('active');
            document.getElementById('addMarkerBtn').textContent = 'Position wählen...';
            document.getElementById('instructionBanner').classList.add('active');
            document.getElementById('map').classList.add('picking-location');
        }

        // Position auswählen deaktivieren
        function stopPickingLocation() {
            isPickingLocation = false;
            
            // UI zurücksetzen
            document.getElementById('addMarkerBtn').classList.remove('active');
            document.getElementById('addMarkerBtn').textContent = 'Marker hinzufügen';
            document.getElementById('instructionBanner').classList.remove('active');
            document.getElementById('map').classList.remove('picking-location');
            
            // Temporären Marker entfernen
            if (tempMarker) {
                map.removeLayer(tempMarker);
                tempMarker = null;
            }
        }

        // Karten-Klick Event
        map.on('click', function(e) {
            if (isPickingLocation) {
                // Position speichern
                currentPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
                
                // Temporären Preview-Marker anzeigen
                if (tempMarker) {
                    map.removeLayer(tempMarker);
                }
                
                const tempIcon = L.divIcon({
                    className: 'temp-marker-icon',
                    iconSize: [20, 20]
                });
                
                tempMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: tempIcon }).addTo(map);
                
                // Picking-Modus beenden
                stopPickingLocation();
                
                // Modal öffnen
                openModal();
            }
        });

        // Modal Funktionen
        function openModal() {
            document.getElementById('modal').classList.add('active');
            document.getElementById('marker-name').focus();
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
            document.getElementById('marker-name').value = '';
            document.getElementById('marker-description').value = '';
            
            // Temporären Marker entfernen
            if (tempMarker) {
                map.removeLayer(tempMarker);
                tempMarker = null;
            }
            
            currentPosition = null;
        }

        function saveMarker() {
            const name = document.getElementById('marker-name').value.trim();
            const description = document.getElementById('marker-description').value.trim();
            
            // Validierung
            if (!name) {
                alert('Bitte gib einen Namen ein!');
                return;
            }

            // Temporären Marker entfernen
            if (tempMarker) {
                map.removeLayer(tempMarker);
                tempMarker = null;
            }

            // Marker erstellen
            addMarkerToMap(currentPosition.lat, currentPosition.lng, name, description);
            
            // Modal schließen
            closeModal();
        }

        // Marker zur Karte hinzufügen
        function addMarkerToMap(lat, lng, name, description) {
            const now = new Date().toLocaleString('de-DE');
            
            // Popup HTML erstellen
            let popupHTML = `<div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0;">${name}</h3>`;
            
            if (description) {
                popupHTML += `<p style="margin: 0 0 10px 0;">${description}</p>`;
            }
            
            popupHTML += `<small style="color: #666;">Hinzugefügt: ${now}</small><br>
                <button onclick="deleteMarker(${lat}, ${lng})" style="margin-top: 10px; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Löschen</button>
            </div>`;
            
            // Marker erstellen
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(popupHTML).openPopup();
            
            // Zu Array hinzufügen und speichern
            markers.push({ 
                lat, 
                lng, 
                name, 
                description,
                timestamp: now
            });
            saveMarkers();
            
            console.log('Marker gespeichert:', { lat, lng, name, description });
        }

        // Marker speichern
        function saveMarkers() {
            localStorage.setItem('puffPointMarkers', JSON.stringify(markers));
        }

        // Gespeicherte Marker laden
        function loadMarkers() {
            const saved = localStorage.getItem('puffPointMarkers');
            if (saved) {
                const markerData = JSON.parse(saved);
                markerData.forEach(data => {
                    let popupHTML = `<div style="min-width: 200px;">
                        <h3 style="margin: 0 0 10px 0;">${data.name}</h3>`;
                    
                    if (data.description) {
                        popupHTML += `<p style="margin: 0 0 10px 0;">${data.description}</p>`;
                    }
                    
                    popupHTML += `<small style="color: #666;">Hinzugefügt: ${data.timestamp}</small><br>
                        <button onclick="deleteMarker(${data.lat}, ${data.lng})" style="margin-top: 10px; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Löschen</button>
                    </div>`;
                    
                    const marker = L.marker([data.lat, data.lng]).addTo(map);
                    marker.bindPopup(popupHTML);
                });
            }
        }

        // Marker löschen
        function deleteMarker(lat, lng) {
            if (confirm('Möchtest du diesen Marker wirklich löschen?')) {
                markers = markers.filter(m => m.lat !== lat || m.lng !== lng);
                saveMarkers();
                location.reload();
            }
        }

        // Enter-Taste im Modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && document.getElementById('modal').classList.contains('active')) {
                if (e.target.tagName !== 'TEXTAREA') {
                    saveMarker();
                }
            } else if (e.key === 'Escape') {
                if (document.getElementById('modal').classList.contains('active')) {
                    closeModal();
                } else if (isPickingLocation) {
                    stopPickingLocation();
                }
            }
        });

        // Klick außerhalb des Modals schließt es
        document.getElementById('modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Beim Laden: Gespeicherte Marker anzeigen
        loadMarkers();

