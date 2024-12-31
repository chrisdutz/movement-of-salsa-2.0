import {Card} from "primereact/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {LatLngTuple} from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

export default function AboutMainModule() {
    const position:LatLngTuple = [49.85071194322454, 8.628659554411506]

    return (
        <>
            <Card title="Team" className={"mb-4"}>
                <div className="flex flex-column md:flex-row gap-4">
                    {/* Left Column */}
                    <div className="flex flex-column align-items-center md:align-items-start">
                        <h3>Olli und Julia</h3>
                        <img
                            width="240"
                            src="https://movement-of-salsa.de/VAADIN/themes/mos/layouts/../images/team/olli-and-julia.jpg"
                            alt="Olli und Julia"
                        />
                        <ul>
                            <li>Tanzunterricht Salsa und Bachata</li>
                            <li>Privater Tanzunterricht</li>
                            <li>DJ'ing</li>
                            <li>Partys</li>
                        </ul>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-column">
                        <p>
                            „The Movement of Salsa“ entstand aus dem Vorhaben heraus etwas Eigenes
                            machen zu wollen – Olli und Julia lernten sich durch das Salsa tanzen
                            kennen. Beide entdeckten ihre Leidenschaft in der Darmstädter Dance
                            Academy mambolicious.
                        </p>
                        <p>
                            Olli startete dort im Jahr 2006 mit dem Salsa tanzen. Schnell war er in
                            organisatorischen Dingen eingebunden und für die Musik zuständig. Als
                            ein Übungsabend eingeführt wurde, wurde Olli zum hauseigenen DJ. Es
                            folgten Tanzunterrichtsvertretungen bis schließlich die
                            Verantwortlichkeit der Anfänger- und Aufbaukurse auf ihn übergingen.
                        </p>
                        <p>
                            Julia startete etwa 5 Jahre später. Sie nutzte jede Gelegenheit als
                            Gastdame zu tanzen, bis sie immer häufiger gefragt wurde zu assistieren.
                            Hieraus entstand eine feste Einheit für die Anfänger- und
                            Aufbaukurse.
                        </p>
                        <p>
                            Als die Dance Academy mambolicious schließen musste, waren sich Olli und
                            Julia einig, dass es trotzdem weitergehen musste. Sie haben von nun an
                            auch die Mittelstufen-Kurse übernommen. Unterrichtet wird
                            New-York-Style. Es folgte Bachata-Unterricht und eigene Parties. Olli
                            legt zusätzlich auch in anderen Tanzschulen auf.
                        </p>
                    </div>
                </div>
            </Card>
            <Card title="Unsere Home-Base">
                <p>Die meisten unserer Kurse finden bei VGH Vereinsheim, Heimstetten Weg 100,64295
                    Darmstadt statt. Bitte achtet aber darauf, dass Kurse auch an anderen Locations
                    stattfinden können.</p>
                <MapContainer center={position} zoom={13} scrollWheelZoom={false}
                              style={{height: "400px", width: "100%"}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            A pretty CSS3 popup. <br/> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </Card>
        </>
    )
}
