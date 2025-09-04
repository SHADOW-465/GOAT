import { PrismaClient, Role, TaskStatus, Priority, ShootStatus, EditingStatus, LeadStatus, InvoiceStatus, NotificationCategory } from '@prisma/client';
import { subDays, addDays, addMonths } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  try {
    // Clean up existing data
    await prisma.timeLog.deleteMany();
    await prisma.shootAssignment.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.revenue.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.shoot.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();
    await prisma.scriptVersion.deleteMany();
    await prisma.script.deleteMany();
    await prisma.editingTask.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.faq.deleteMany();
    console.log('Cleaned up existing data.');

    // --- USERS ---
    const alex = await prisma.user.create({
      data: {
        email: 'alex.employee@goat.media',
        name: 'Alex Doe',
        role: Role.EMPLOYEE,
      },
    });

    const mia = await prisma.user.create({
      data: {
        email: 'mia.exec@goat.media',
        name: 'Mia Wong',
        role: Role.EXECUTIVE,
      },
    });
    console.log(`Created users: ${alex.name}, ${mia.name}`);

    // --- CLIENTS ---
    const clients = [];
    for (let i = 1; i <= 10; i++) {
      const client = await prisma.client.create({
        data: {
          name: `Client Corp ${i}`,
          email: `contact@client${i}.com`,
        },
      });
      clients.push(client);
    }
    console.log(`Created ${clients.length} clients.`);

    // --- PROJECTS ---
    const project1 = await prisma.project.create({ data: { name: 'Q3 Marketing Campaign' } });
    const project2 = await prisma.project.create({ data: { name: 'Website Redesign' } });
    console.log(`Created projects: ${project1.name}, ${project2.name}`);

    // --- TASKS ---
    const tasks = [];
    for (let i = 0; i < 30; i++) {
      const task = await prisma.task.create({
        data: {
          title: `Design social media graphic #${i + 1}`,
          description: 'Create a graphic for the upcoming social media post.',
          status: i % 4 === 0 ? TaskStatus.COMPLETED : i % 4 === 1 ? TaskStatus.IN_PROGRESS : TaskStatus.PENDING,
          priority: i % 4 === 0 ? Priority.HIGH : i % 4 === 1 ? Priority.URGENT : Priority.MEDIUM,
          dueDate: addDays(new Date(), i - 15),
          assigneeId: alex.id,
          projectId: i % 2 === 0 ? project1.id : project2.id,
        },
      });
      tasks.push(task);
    }
    console.log(`Created ${tasks.length} tasks.`);

    // --- SHOOTS ---
    const shoots = [];
    for (let i = 0; i < 6; i++) {
      const shoot = await prisma.shoot.create({
        data: {
          title: `Product Photoshoot ${i + 1}`,
          startTime: addDays(new Date(), i * 5 + 2),
          endTime: addDays(new Date(), i * 5 + 2, { hours: 4 }),
          location: `Studio ${i % 2 === 0 ? 'A' : 'B'}`,
          status: i % 3 === 0 ? ShootStatus.APPROVED : ShootStatus.PENDING,
          clientId: clients[i % clients.length].id,
        },
      });
      shoots.push(shoot);
    }
    console.log(`Created ${shoots.length} shoots.`);

    // --- SHOOT ASSIGNMENTS ---
    await prisma.shootAssignment.create({ data: { shootId: shoots[0].id, userId: alex.id, role: 'Photographer' } });
    await prisma.shootAssignment.create({ data: { shootId: shoots[1].id, userId: alex.id, role: 'Assistant' } });
    console.log('Created shoot assignments.');

    // --- LEADS ---
    for (let i = 0; i < 10; i++) {
      await prisma.lead.create({
        data: {
          name: `Lead Person ${i + 1}`,
          email: `lead${i}@example.com`,
          status: i % 5 === 0 ? LeadStatus.CONVERTED : i % 5 === 1 ? LeadStatus.QUALIFIED : i % 5 === 2 ? LeadStatus.CONTACTED : LeadStatus.NEW,
          assigneeId: i % 3 === 0 ? mia.id : alex.id,
        },
      });
    }
    console.log('Created 10 leads.');

    // --- INVOICES, REVENUE, EXPENSES ---
    for (let i = 0; i < 8; i++) {
      const invoice = await prisma.invoice.create({
        data: {
          amount: 1200 + i * 150,
          status: i % 3 === 0 ? InvoiceStatus.PAID : InvoiceStatus.UNPAID,
          dueDate: addDays(new Date(), i * 10 - 30),
          clientId: clients[i].id,
        },
      });
      if (invoice.status === InvoiceStatus.PAID) {
        await prisma.revenue.create({
          data: {
            amount: invoice.amount,
            date: subDays(new Date(), 35 - i * 5),
            invoiceId: invoice.id,
          },
        });
      }
    }
    console.log('Created 8 invoices and associated revenue.');

    for (let i = 0; i < 12; i++) {
      await prisma.expense.create({
        data: {
          description: `Software Subscription ${i + 1}`,
          amount: 150 + Math.random() * 100,
          date: subDays(addMonths(new Date(), -i), 15),
        },
      });
    }
    console.log('Created 12 months of expenses.');

    // --- SCRIPTS & EDITING ---
    const script = await prisma.script.create({ data: { title: 'New Commercial Spot' } });
    await prisma.scriptVersion.create({ data: { scriptId: script.id, content: 'Version 1 content...', version: 1 } });
    await prisma.scriptVersion.create({ data: { scriptId: script.id, content: 'Version 2 content, revised.', version: 2 } });
    console.log('Created a script with 2 versions.');

    const editingTask = await prisma.editingTask.create({
      data: {
        title: 'Edit Commercial Spot',
        status: EditingStatus.IN_REVIEW,
        files: '["/uploads/file1.mp4", "/uploads/file2.mov"]',
      },
    });
    await prisma.comment.create({
      data: {
        editingTaskId: editingTask.id,
        content: 'Please adjust the color grading at 0:32.',
        timestamp: 32.5,
      },
    });
    console.log('Created an editing task with a comment.');

    // --- NOTIFICATIONS ---
    await prisma.notification.create({
      data: {
        message: 'Your assigned task "Design social media graphic #1" is due tomorrow.',
        category: NotificationCategory.URGENT,
        userId: alex.id,
      },
    });
    await prisma.notification.create({
      data: {
        message: 'New lead "Lead Person 9" has been assigned to you.',
        category: NotificationCategory.SYSTEM,
        userId: mia.id,
      },
    });
    console.log('Created notifications.');

    // --- FAQ ---
    await prisma.faq.create({
      data: {
        question: 'How do I reset my password?',
        answer: 'Currently, the login system is a dummy. Password resets are not applicable. Use the provided credentials.',
      },
    });
    await prisma.faq.create({
      data: {
        question: 'Where can I see my assigned tasks?',
        answer: 'Navigate to the "My Tasks Hub" on your dashboard.',
      },
    });
    console.log('Created FAQ entries.');

  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('... seeding finished.');
  }
}

main();
