Ninja fbox aha driver
===
This driver makes Fritz!Dect 200 and Fritz!Powerline 546E devices accassible from within the Ninjablock dashboard.

## Restrictions
Please be aware that this is not an official driver from the manufacturer. I created this from my personal use and want to share it:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Usage
Use the ”Drivers” button on your dashboard to add your Fritzbox(es) or 546E devices. The driver searches for every aha device connected to your box. Note that you need at least OS 05.50 as firmware. Please add only one box if you activated to share “Smart Home” functionality across your Fritzbox home network, because currently the driver is not able to detect duplicated aha devices.

The password will not be encrypted (till now). So, I strongly recommend to create a dedicated account in the systems settings of your box, that is restricted to the use of the “Smart Home” functionality and to deactivate the permission to access the box from the internet with this account.

## Installation
tbd


## Dashboard
![ScreenShot](https://raw.github.com/benzarts/fboxaha/master/dashboard.png)

## Credits
I'm using the following node modules to make my life easier:
[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js),
[node-iconv](https://github.com/bnoordhuis/node-iconv)
