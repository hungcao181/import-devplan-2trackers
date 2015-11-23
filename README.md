This provide a very simple script to import a development plan into tracker tools from text file. 
Currently support:
* Pivotal Tracker
* Gitlab issues

To start, open your terminal:
1. > git clone https://github.com/hungcao181/import-devplan-2trackers.git

2. > cd import-devplan-2trackers

3. > npm install

4. copy your devplan into data.txt.template file

Note: Be sure the format of data.
 
* Sprint, Epic, Story must be prefixed accordingly with Sprint:, Epic:, story:
* Sprint name must be number

5. edit client.secret.template file with your secret info

6. rename data.txt.template to data.txt, client.secret.template to client.secret

7. > npm start

Here we go!