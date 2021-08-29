//import pdfDocument from 'pdfkit'
import fs from 'fs'
import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'

const permissionsDatabase = new db.table('permissionsDatabase')

export default {
    name: 'report',
    description: `Para criar um relatório use ${prefix}report`,
    permissions: ['everyone'],
    aliases: [],
    run: ({ message, client, args }) => {

        message.channel.send("comando a ser feito")
        return

        const doc = new pdfDocument()


        const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.';

        doc.fontSize(8);
        doc.text(`This text is left aligned. ${lorem}`, {
            width: 410,
            align: 'left'
        });

        doc.moveDown();
        doc.text(`This text is centered. ${lorem}`, {
            width: 410,
            align: 'center'
        });

        doc.moveDown();
        doc.text(`This text is right aligned. ${lorem}`, {
            width: 410,
            align: 'right'
        });

        doc.moveDown();
        doc.text(`This text is justified. ${lorem}`, {
            width: 410,
            align: 'justify'
        });

        // draw bounding rectangle
        doc.rect(doc.x, 0, 410, doc.y).stroke();


        doc.pipe(fs.createWriteStream('../generateReport/output.pdf'))



        doc.fontSize(25)
            .text('Some text with an embedded font!', 100, 100)





        doc.end();
        message.channel.send({ files: '../generateReport/output.pdf' })

    }
}